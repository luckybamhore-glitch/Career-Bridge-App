import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import roadmapService from '../services/roadmapService';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { updateCredits } from '../features/auth/authSlice';

export default function RoadmapGenerator() {


  const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
  const {user}  = useSelector(state => state.auth)


   const {mutate , data , isPending , isError , isSuccess , error} = useMutation({mutationFn: (credentials) => roadmapService.generateRoadmap(credentials)})

  const [fromData , setFromData] = useState({
    interest : "" ,
     skill_level :""  ,
     budget : "" ,
     learning_mode : "" ,
     additional_info : ""
  })

  const {interest , skill_level , budget , learning_mode , additional_info} = fromData


  const handlerChange = (e) => {
    
     setFromData({
      ...fromData ,
       [e.target.name] : e.target.value
     })

  }
  const handlerSubmit = (e) => {
    e.preventDefault()
    mutate({
      token : user.token ,
      ...fromData
    })
   
  }



   useEffect(()=>{

    if(isSuccess && data){
        if (typeof data.credits === "number") {
          dispatch(updateCredits(data.credits));
        }
        queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["creditHistory"] });

        navigate("/auth/profile/my-roadmaps")
    }


       if (isError && error) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
           
        }
   },[isError , error , isSuccess ,data])


   
  if(isPending){

    return (
      <LoadingScreen loadingMessage='Generating Roadmap' />
    )
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="roadmap" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="roadmap" role="student" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header */}
          <div className="mb-8 max-w-3xl">
            <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
              AI ENGINE V2.4
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
              Generate Custom <span className="text-rust">AI Career Roadmap</span>
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Answer a few questions to generate a step-by-step learning path customized for the Indian tech and job market.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop relative">
                <div className="absolute -top-3 -right-3 bg-rust text-white font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-2 border-navy rotate-3 shadow-pop-sm">
                  {user?.credits} Credits / Generation
                </div>

                <form onSubmit={handlerSubmit} className="space-y-6">
                  {/* Step 1: Target Role */}
                  <div>
                    <label className="block font-grotesk font-extrabold text-sm uppercase tracking-wider text-navy mb-2">
                      1. Target Career Role
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      name='interest'
                      value={interest}
                      onChange={handlerChange}
                      placeholder="e.g. Data Scientist, IAS Officer, Product Manager..."
                      className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-3 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                    />
                  </div>

                  {/* Step 2: Current Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-2">
                        2. Current Knowledge Level
                      </label>
                      <select name='skill_level'  onChange={handlerChange} value={skill_level}
                       className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none">
                        <option value="">
                            Select Level </option>
                        <option value={"beginner"} >Beginner </option>
                        <option value={'intermediate'} >Intermediate </option>
                        <option value={'advanced'}>Advanced </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-2">
                        3.Learning Mode
                      </label>
                      <select onChange={handlerChange} value={learning_mode} name='learning_mode'
                      className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none">
                       <option value="">
                            Select Mode
                        </option> 
                      
                        <option value={'hybrid'}> Hybrid</option>
                        <option value={'online'}>Online</option>
                        <option value={'offline'} >Offline </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-grotesk font-extrabold text-sm uppercase tracking-wider text-navy mb-2">
                      4. Budget (INR)
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      name='budget'
                      value={budget}
                      onChange={handlerChange}
                      placeholder= "Enter Your Budget"
                      className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-3 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                    />
                  </div>

                  {/* Step 4: Special Instructions */}
                  <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-2">
                      5. Specific Goal / Background Notes
                    </label>
                    <textarea
                      rows={3} 
                      name='additional_info'
                      onChange={handlerChange} 
                      value={additional_info}
                      defaultValue=""
                      placeholder="Share your specific constraints..."
                      className="w-full bg-parchment border-3 border-navy rounded-xl p-4 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t-2 border-navy/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="font-mono text-xs text-navy-muted font-bold">
                      <span className="text-rust"> Credits & </span> (Balance: {user?.credits})
                    </div>
                    <Button type='submit' variant="primary" size="lg">
                      ⚡ GENERATE AI ROADMAP NOW →
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Information Side Panel */}
            <div className="space-y-6">
              <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <StatusBadge text="HOW IT WORKS" status="success" />
                <h3 className="font-grotesk font-extrabold text-xl text-navy mt-3">Tailored for Indian Students</h3>
                <p className="font-body text-xs text-navy mt-2 leading-relaxed">
                  Our AI engine analyzes real hiring patterns across Indian IT hubs (Bengaluru, Hyderabad, Gurgaon, Pune) to build month-by-month phase milestones.
                </p>
              </div>

              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h3 className="font-grotesk font-extrabold text-lg text-navy mb-3">What You Will Get:</h3>
                <ul className="space-y-3 font-body text-xs text-navy">
                  <li className="flex items-start space-x-2">
                    <span className="text-rust font-bold">✓</span>
                    <span>Month-by-month phase breakdown with project ideas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rust font-bold">✓</span>
                    <span>Direct links to top free documentation & courses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rust font-bold">✓</span>
                    <span>Interview question banks & salary expectations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
