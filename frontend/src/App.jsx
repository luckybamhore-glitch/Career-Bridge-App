import React, { useState } from 'react';
import { BrowserRouter as Router ,Routes ,Route  } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import CareerExplorer from './pages/CareerExplorer';
import CareerDetail from './pages/CareerDetail';
import CounselorList from './pages/CounselorList';
import CounselorProfile from './pages/CounselorProfile';
import ChatPage from './pages/ChatPage';
import DirectChat from './pages/DirectChat';
import RoadmapGenerator from './pages/RoadmapGenerator';
import RoadmapResult from './pages/RoadmapResult';
import MyCredits from './pages/MyCredits';
import BecomeCounselor from './pages/BecomeCounselor';
import CounselorDashboard from './pages/CounselorDashboard';
import CounselorMessages from './pages/CounselorMessages';
import CounselorReviews from './pages/CounselorReviews';
import AdminOverview from './pages/AdminOverview';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminCounselorApprovals from './pages/AdminCounselorApprovals';
import AdminCreditRequests from './pages/AdminCreditRequests';
import AdminAiAssistant from './pages/AdminAiAssistant';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateComponent from './components/PrivateComponent';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';


export default function App() {

   const queryClient = new QueryClient()

  return (


    <QueryClientProvider client={queryClient} >
<Router>
  <Routes>
    <Route path='*' element = {<NotFoundPage/>}/>
    <Route path='/' element = {<LandingPage/>}/>
    <Route path='/login' element = {<LoginPage/>}/>
    <Route path='/register' element = {<RegisterPage/>}/>
    <Route path='/auth' element = {<PrivateComponent/>}>
    <Route path='admin' element = {<AdminOverview/>} />
    <Route path='admin/users' element = {<AdminUsers/>} />
    <Route path='admin/categories' element = {<AdminCategories/>} />
    <Route path='admin/approvals' element = {<AdminCounselorApprovals/>} />
    <Route path='admin/credits_requests' element = {<AdminCreditRequests/>} />
    <Route path='admin/ai' element = {<AdminAiAssistant/>} />
    <Route path='counselor' element = {<CounselorDashboard/>} />
    <Route path='counselor/messages' element = {<CounselorMessages/>} />
    <Route path='counselor/reviews' element = {<CounselorReviews/>} />
    <Route path='profile' element = {<StudentDashboard/>} />
    <Route path='profile/become-counselor' element = {<BecomeCounselor/>} />
    <Route path='profile/my-credits' element = {<MyCredits/>} />
    <Route path='profile/chat' element = {<ChatPage/>} />
    <Route path='profile/chat/:uid' element = {<DirectChat/>} />
    <Route path='profile/my-roadmaps' element = {<RoadmapResult/>} />
    <Route path='careers' element = {<CareerExplorer/>} />
    <Route path='counselors' element = {<CounselorList/>} />
    <Route path='counselors/:id' element = {<CounselorProfile/>} />
    <Route path='ai-roadmap' element = {<RoadmapGenerator/>} />
     </Route>
   
  </Routes>
  <Toaster/>
</Router>
</QueryClientProvider>
  );
}
