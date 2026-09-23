"use client";

import { useEffect,useMemo,useState } from "react";
import { Send, ShieldCheck } from "lucide-react";

type Item={id:string;title:string;type:string};

export function RequestVerification(){
  const [items,setItems]=useState<Item[]>([]);
  const [selected,setSelected]=useState("");
  const [organization,setOrganization]=useState("");
  const [email,setEmail]=useState("");
  const [role,setRole]=useState("");
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    fetch("/api/profile",{cache:"no-store"}).then(r=>r.json()).then(data=>{
      const d=data.user?.profile?.fullData||{};
      const list:Item[]=[];
      (d.experiences||[]).forEach((x:any)=>list.push({id:String(x.id),title:`${x.jobTitle||x.role||"Experience"} — ${x.company||""}`,type:"EXPERIENCE"}));
      (d.educations||[]).forEach((x:any)=>list.push({id:String(x.id),title:`${x.degree||"Education"} — ${x.institution||""}`,type:"EDUCATION"}));
      (d.projects||[]).forEach((x:any)=>list.push({id:String(x.id),title:x.name||x.title||"Project",type:"PROJECT"}));
      (d.achievements||[]).forEach((x:any)=>list.push({id:String(x.id),title:x.title||"Achievement",type:"ACHIEVEMENT"}));
      setItems(list);
      if(list[0])setSelected(list[0].id);
    }).catch(()=>{});
  },[]);

  const item=useMemo(()=>items.find(x=>x.id===selected),[items,selected]);

  const submit=async()=>{
    if(!item||!organization.trim()||!email.trim()||!role.trim())return;
    setSaving(true);
    setMessage("");
    try{
      const r=await fetch("/api/verification/request",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          type:item.type,
          itemId:item.id,
          title:item.title,
          organizationName:organization,
          verifierEmail:email,
          verifierRole:role,
        })
      });
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||"Unable to send request");
      setMessage("Verification request sent to the verifier's email.");
      setEmail("");
      setRole("");
    }catch(e:any){setMessage(e.message)}
    finally{setSaving(false)}
  };

  return <section className="rounded-3xl border border-blue-100 bg-blue-50/40 p-6 sm:p-8 shadow-sm space-y-5">
    <div>
      <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-600"/><h2 className="text-base font-black text-slate-900">Request Verification</h2></div>
      <p className="mt-1 text-xs text-slate-600">Send a secure verification request directly to an employer, university representative, professor or project supervisor.</p>
    </div>
    {items.length===0
      ? <p className="rounded-2xl bg-white border border-blue-100 p-4 text-xs text-slate-500">Add an experience, education, project or achievement first.</p>
      : <>
        <select value={selected} onChange={e=>setSelected(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm">
          {items.map(x=><option key={x.id} value={x.id}>{x.type}: {x.title}</option>)}
        </select>
        <input value={organization} onChange={e=>setOrganization(e.target.value)} placeholder="Organization / university / employer" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Verifier's work / institutional email" className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"/>
          <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Verifier role (Professor, HR, Registrar...)" className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"/>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Use an appropriate organizational representative. Having an institutional email alone does not prove that a person is authorized to verify the record.
        </div>
        <button onClick={submit} disabled={saving||!organization.trim()||!email.trim()||!role.trim()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
          <Send className="h-4 w-4"/>{saving?"Sending...":"Send verification request"}
        </button>
        {message&&<p className="text-xs font-semibold text-blue-700">{message}</p>}
      </>
    }
  </section>;
}
