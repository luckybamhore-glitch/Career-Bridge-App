import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ChatBubble from '../components/ChatBubble';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setMessage } from '../features/admin/adminSlice';
import { useMutation } from '@tanstack/react-query';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';
import TypingBubble from '../components/TypingBubble';

export default function AdminAiAssistant() {
  


const dispatch = useDispatch()
const {user} = useSelector(state => state.auth)

const {messages} = useSelector(state => state.admin)
const {mutate , data , isPending , isSuccess , isError , error} = useMutation({mutationFn : (credentials)=> adminService.askQuestion(credentials)})
   
const [text , setText] = useState("")


const handleSubmit = (e) => {
  e.preventDefault()
  mutate({
    token : user.token ,
    text : text
  })

  dispatch(setMessage({ id: crypto.randomUUID(), sender: 'Admin', time: new Date(Date.now()).toLocaleTimeString("en-IN") , message: text, isSelf: true }))
  setText("")
}


useEffect(()=> {

if(isSuccess){
  dispatch(setMessage({ id: crypto.randomUUID(), sender: 'A.I', time: new Date(Date.now()).toLocaleTimeString("En-In") , message: data.answer, isSelf: false }))
}
if(isError && error){
  toast.error(error.message)
}

},[data , isSuccess , isError , error])
  
  


  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="admin" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="admin_ai" role="admin" />

        {/* <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          <div className="mb-8">
            <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
              AI ENGINE PROMPTS
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
              AI Roadmap <span className="text-rust">Prompt Configuration</span>
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Tune system prompts, tokens usage budgets, and model parameters for the CareerBridge AI generator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop space-y-6">
                <div>
                  <label className="block font-grotesk font-extrabold text-sm uppercase text-navy mb-2">
                    Global System Prompt Instruction
                  </label>
                  <textarea
                    rows={6}
                    defaultValue="You are CareerBridge AI, an expert career advisor specializing in the Indian job market. Always structure roadmaps in 4 distinct phases (Foundations, Core Stack, Real-World Projects, Placement & Salary Prep). Benchmarks must reflect realistic INR packages in Indian tech hubs."
                    className="w-full bg-parchment border-3 border-navy rounded-xl p-4 font-mono text-xs text-navy shadow-pop-sm focus:outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                      Model Temperature
                    </label>
                    <input
                      type="text"
                      defaultValue="0.4 (Balanced & Precise)"
                      className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2 font-mono text-xs text-navy shadow-pop-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                      Max Output Tokens
                    </label>
                    <input
                      type="text"
                      defaultValue="2,048 Tokens"
                      className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2 font-mono text-xs text-navy shadow-pop-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-navy/20 flex justify-end">
                  <Button variant="primary" size="md">
                    Save AI Prompt Config 💾
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <StatusBadge text="TOKEN USAGE" status="success" />
                <h3 className="font-grotesk font-extrabold text-xl text-navy mt-3">Daily AI Cost Metrics</h3>
                <div className="mt-4 space-y-2 font-mono text-xs text-navy">
                  <div className="flex justify-between">
                    <span>• Roadmaps Today:</span>
                    <span className="font-bold">412 calls</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Avg Token Latency:</span>
                    <span className="font-bold">1.2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• API Model Cost:</span>
                    <span className="font-bold text-rust">$4.20 / day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main> */}


           <div className="flex-1 flex flex-col justify-between bg-parchment-card min-h-[500px]">
              {/* Chat Window Header */}
              <div className="p-3 sm:p-4 border-b-4 border-navy bg-yellow/30 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-sm text-navy">
                      A.I 
                  </div>
                  <div>
                    <h2 className="font-grotesk font-extrabold text-base text-navy">A.I Assistant</h2>
                  </div>
                </div>
             
              </div>

              {/* Chat Messages Log */}
              {/* <div className="p-6 overflow-y-auto space-y-4 max-h-[460px] bg-grid-pattern">
                {messages?.map((msg) => (
                  <ChatBubble key={msg.id} sender={msg.sender} time={msg.time} message={msg.message} isSelf={msg.isSelf} />

                ))}
              </div> */}
              {/* Chat Messages Log */}
<div className="p-3 sm:p-6 overflow-y-auto space-y-4 max-h-[380px] sm:max-h-[460px] bg-grid-pattern flex-1">
  {messages?.map((msg) => (
    <ChatBubble key={msg.id} sender={msg.sender} time={msg.time} message={msg.message} isSelf={msg.isSelf} />
  ))}
  {isPending && <TypingBubble />}
</div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 border-t-4 border-navy bg-parchment">
                <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
                 
                  <input
                    type="text"
                    defaultValue= ""
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 min-w-0 bg-white border-3 border-navy rounded-xl px-3 sm:px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                  />
                  <Button type='submit' variant="primary" size="md">
                    Send Message ➔
                  </Button>
                </form>
              </div>
            </div>
      </div>
    </div>
  );
}
