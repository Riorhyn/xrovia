import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken,setSessionCookie } from "@/lib/auth/session";

function slugify(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70);}

export async function POST(req:Request){
  try{
    const b=await req.json();
    const email=String(b.email||"").trim().toLowerCase(), code=String(b.code||"").trim(), password=String(b.password||"");
    if(!email||!code||password.length<8)return NextResponse.json({error:"Email, registration code, and a password of at least 8 characters are required."},{status:400});
    const request=await prisma.organizationVerificationRequest.findFirst({where:{contactEmail:email,status:"APPROVED"},orderBy:{createdAt:"desc"}});
    if(!request||!request.registrationCodeHash||!request.registrationCodeExpiresAt)return NextResponse.json({error:"No active approved organization registration request was found for this email."},{status:400});
    if(request.registrationCodeUsedAt)return NextResponse.json({error:"This registration code has already been used."},{status:400});
    if(new Date()>request.registrationCodeExpiresAt)return NextResponse.json({error:"This registration code has expired. Contact XROVIA for a new code."},{status:400});
    if(!(await bcrypt.compare(code,request.registrationCodeHash)))return NextResponse.json({error:"Invalid registration code."},{status:400});

    const existingUser=await prisma.user.findUnique({where:{email}});
    if(existingUser && !(await bcrypt.compare(password,existingUser.passwordHash))) return NextResponse.json({error:"This email already has an XROVIA account. Enter that account password to add the verified organization to the same account."},{status:409});

    const existingOrg=await prisma.organization.findFirst({where:{name:{equals:request.name,mode:"insensitive"}}});
    if(existingOrg)return NextResponse.json({error:"This organization already exists on XROVIA."},{status:409});

    const passwordHash=await bcrypt.hash(password,12);
    const result=await prisma.$transaction(async tx=>{
      const user=existingUser || await tx.user.create({data:{email,passwordHash,country:request.country,emailVerifiedAt:new Date()}});\n      if(existingUser && !existingUser.emailVerifiedAt) await tx.user.update({where:{id:existingUser.id},data:{emailVerifiedAt:new Date()}});
      const base=slugify(request.name)||"organization"; let slug=base;
      for(let i=0;i<5;i++){const found=await tx.organization.findUnique({where:{slug}});if(!found)break;slug=base+"-"+String(1000+i);}
      if(await tx.organization.findUnique({where:{slug}}))throw new Error("Could not create unique organization identifier.");
      const org=await tx.organization.create({data:{name:request.name,slug,type:request.type,website:request.website||"https://example.invalid",officialEmailDomain:"",country:request.country,status:"VERIFIED",verifiedAt:new Date(),members:{create:{userId:user.id,role:"OWNER",jobTitle:request.jobTitle}}}});
      await tx.organizationVerificationRequest.update({where:{id:request.id},data:{status:"REGISTERED",registrationCodeUsedAt:new Date(),registeredOrganizationId:org.id}});
      return {user,org};
    });
    const token=await createSessionToken({userId:result.user.id,email:result.user.email,role:result.user.role,organizationId:result.org.id,organizationMemberId:(await prisma.organizationMember.findUnique({where:{organizationId_userId:{organizationId:result.org.id,userId:result.user.id}}}))?.id,organizationRole:"OWNER"});
    const response=NextResponse.json({message:"Organization registered successfully.",organization:result.org,redirectTo:"/organization"},{status:201});
    setSessionCookie(response,token); return response;
  }catch(error){console.error("Verified organization registration error:",error);return NextResponse.json({error:"Could not complete organization registration."},{status:500});}
}
