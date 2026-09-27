import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { randomInt } from "crypto";

const TYPES = new Set(["UNIVERSITY","COMPANY","TRAINING_PROVIDER","PROFESSIONAL_BODY","OTHER"]);
const PERSONAL_EMAIL_DOMAINS = new Set(["gmail.com","googlemail.com","yahoo.com","yahoo.co.in","outlook.com","hotmail.com","live.com","msn.com","icloud.com","me.com","proton.me","protonmail.com","mail.com","aol.com","gmx.com","zoho.com"]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name=String(body.name||"").trim(), type=String(body.type||"").trim().toUpperCase();
    const website=String(body.website||"").trim(), country=String(body.country||"").trim();
    const contactEmail=String(body.contactEmail||"").trim().toLowerCase();
    const applicantName=String(body.applicantName||"").trim(), jobTitle=String(body.jobTitle||"").trim();
    const department=String(body.department||"").trim(), employmentType=String(body.employmentType||"").trim();
    const associationDuration=String(body.associationDuration||"").trim(), phone=String(body.phone||"").trim();
    const authorizationReason=String(body.authorizationReason||"").trim();
    const officialProfileUrl=String(body.officialProfileUrl||"").trim(), evidenceUrl=String(body.evidenceUrl||"").trim();
    const evidenceDescription=String(body.evidenceDescription||"").trim();

    if(!name||!type||!country||!contactEmail||!applicantName||!jobTitle||!authorizationReason)
      return NextResponse.json({error:"Organization name, type, country, email, applicant name, job title, and authorization details are required."},{status:400});
    if(!TYPES.has(type)) return NextResponse.json({error:"Choose a valid organization type."},{status:400});
    if(!/^[^@\s]+@[^@\s]+$/.test(contactEmail)) return NextResponse.json({error:"Enter a valid email address."},{status:400});
    const domain=contactEmail.split("@")[1].toLowerCase();
    if(!PERSONAL_EMAIL_DOMAINS.has(domain)) return NextResponse.json({error:"Use this request flow only when the organization does not have an official organization email domain."},{status:400});
    if(website){ try{new URL(/^https?:\/\//i.test(website)?website:"https://"+website);}catch{return NextResponse.json({error:"Enter a valid website or leave it blank."},{status:400});} }

    const existing=await prisma.organizationVerificationRequest.findFirst({
      where:{contactEmail,status:{in:["UNDER_REVIEW","MORE_INFORMATION_REQUIRED","APPROVED"]}},
      orderBy:{createdAt:"desc"}
    });
    if(existing) return NextResponse.json({error:"You already have an active XROVIA organization verification request for this email.",requestId:existing.id,status:existing.status},{status:409});

    const request=await prisma.organizationVerificationRequest.create({data:{
      name,type:type as any,website:website||null,country,contactEmail,applicantName,jobTitle,
      department:department||null,employmentType:employmentType||null,associationDuration:associationDuration||null,
      phone:phone||null,authorizationReason,officialProfileUrl:officialProfileUrl||null,evidenceUrl:evidenceUrl||null,
      evidenceDescription:evidenceDescription||null
    },select:{id:name as any,status:true,createdAt:true}});
    return NextResponse.json({message:"Verification request submitted to XROVIA for review.",requestId:request.id,status:request.status},{status:201});
  } catch(error){ console.error("Organization verification request error:",error); return NextResponse.json({error:"Could not submit the organization verification request."},{status:500}); }
}
