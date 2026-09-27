import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { sendOrganizationRegistrationCodeEmail, sendOrganizationVerificationDecisionEmail } from "@/lib/email";

async function admin(){const s=await getSession(); return s?.role==="ADMIN"?s:null;}

export async function GET(){
  try{
    if(!await admin()) return NextResponse.json({error:"Admin access required."},{status:403});
    const requests=await prisma.organizationVerificationRequest.findMany({include:{reviewedBy:{select:{email:true}},registeredOrganization:{select:{name:true,slug:true,status:true}}},orderBy:{createdAt:"asc"}});
    return NextResponse.json({requests},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){console.error(error);return NextResponse.json({error:"Could not load verification requests."},{status:500});}
}

export async function PATCH(req:Request){
  try{
    const session=await admin(); if(!session)return NextResponse.json({error:"Admin access required."},{status:403});
    const body=await req.json(); const id=String(body.requestId||"").trim(); const action=String(body.action||"").toUpperCase();
    const note=String(body.reviewNote||"").trim();
    if(!id||!["APPROVE","REJECT","MORE_INFORMATION_REQUIRED"].includes(action))return NextResponse.json({error:"Invalid review action."},{status:400});
    const request=await prisma.organizationVerificationRequest.findUnique({where:{id}});
    if(!request)return NextResponse.json({error:"Verification request not found."},{status:404});
    if(["APPROVED","REJECTED","REGISTERED"].includes(request.status))return NextResponse.json({error:"This request has already been finalized."},{status:409});

    if(action==="APPROVE"){
      const code=String(randomInt(10000000,100000000));
      const expiresAt=new Date(Date.now()+48*60*60*1000);
      const hash=await bcrypt.hash(code,12);
      const updated=await prisma.organizationVerificationRequest.update({where:{id},data:{status:"APPROVED",reviewNote:note||"Organization verification approved by XROVIA.",reviewedById:session.userId,reviewedAt:new Date(),registrationCodeHash:hash,registrationCodeExpiresAt:expiresAt,registrationCodeUsedAt:null}});
      try{await sendOrganizationRegistrationCodeEmail(request.contactEmail,request.name,code,expiresAt);}catch(error){
        await prisma.organizationVerificationRequest.update({where:{id},data:{status:"UNDER_REVIEW",reviewNote:"Email delivery failed; approval was not completed.",reviewedById:null,reviewedAt:null,registrationCodeHash:null,registrationCodeExpiresAt:null}});
        throw error;
      }
      return NextResponse.json({message:"Approved. Registration code sent to the applicant's existing email.",request:updated});
    }

    const status=action==="REJECT"?"REJECTED":"MORE_INFORMATION_REQUIRED";
    const updated=await prisma.organizationVerificationRequest.update({where:{id},data:{status,reviewNote:note|| (status==="REJECTED"?"Organization verification was not approved.":"Please provide additional verification information."),reviewedById:session.userId,reviewedAt:new Date()}});
    try{await sendOrganizationVerificationDecisionEmail(request.contactEmail,request.name,status,updated.reviewNote||"");}catch(error){console.error("Decision email failed:",error);}
    return NextResponse.json({message:status==="REJECTED"?"Request rejected.":"More information requested.",request:updated});
  }catch(error){console.error("Admin organization verification error:",error);return NextResponse.json({error:"Could not update the verification request."},{status:500});}
}
