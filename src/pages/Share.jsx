import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../AuthProvider";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

// --- SVG Icons (Placeholders - Replace with your actual icons) ---

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const WhatsAppIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
   </svg>
);

const CopyLinkIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
   </svg>
);

const MarketingIcon = () => ( // For "Market your app" poster card
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-peach-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3.418" />
  </svg>
);

// Icons for Quick Actions
const QuickMarketIcon = () => ( // Different icon for quick action button
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
    </svg>
);

const PollIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const HelpFriendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

// --- Component ---

function Share() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sharedContent = searchParams.get("content") || ""; // Specific content to share
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [recipientType, setRecipientType] = useState("tutor"); // Default to 'tutor'

  const [baseUrl, setBaseUrl] = useState("");
  const [contentShareLink, setContentShareLink] = useState(""); // Link for the specific content
  const [websiteUrl, setWebsiteUrl] = useState(""); // User's profile/website URL
  const [appShareLink, setAppShareLink] = useState(""); // General App/Website link for promotion

  useEffect(() => {
    const origin = window.location.origin;
    setBaseUrl(origin);

    // Generate shareable link for the specific content passed in URL
    if (sharedContent) {
      const encodedContent = encodeURIComponent(sharedContent);
      setContentShareLink(`${origin}/share?content=${encodedContent}`);
    } else {
      setContentShareLink(""); // No specific content to share
    }

    // Set user's website/profile URL
    const profilePath = currentUser?.uid ? `/profile/${currentUser.uid}` : '/'; // Fallback to home
    setWebsiteUrl(`${origin}${profilePath}`);

    // Set general app/website share link (can be same as website or a specific landing page)
    setAppShareLink(origin); // Example: Use the base URL, adjust if needed

  }, [sharedContent, currentUser]);

  // --- Handlers ---

  const handleDirectShare = () => {
    if (!currentUser) {
      showToast("error", "You must be signed in to share content");
      navigate("/signin");
      return;
    }
    if (!selectedRecipient) {
      showToast("error", "Please select or enter a recipient ID");
      return;
    }
    if (!sharedContent) {
       showToast("error", "No specific content available to share directly.");
       return;
    }

    const notificationId = uuidv4();
    const validRecipientType = recipientType === "tutor" ? "tutors" : "users";
    const notificationPath = `${validRecipientType}/${selectedRecipient}/notifications/${notificationId}`;

    set(ref(db, notificationPath), {
      message: message || `Someone shared content with you!`,
      content: sharedContent,
      link: contentShareLink,
      timestamp: Date.now(),
      from: currentUser.uid,
      senderType: currentUser?.userType || "unknown",
    })
      .then(() => {
        showToast("success", "Content shared successfully!");
        // Optionally clear fields
        // setMessage("");
        // setSelectedRecipient("");
      })
      .catch((error) => {
        showToast("error", `Error sharing content: ${error.message}`);
      });
  };

  const copyToClipboard = (linkToCopy, linkType = "Link") => {
    if (!linkToCopy) {
       showToast("error", `${linkType} not available to copy.`);
       return;
    }
    navigator.clipboard.writeText(linkToCopy);
    showToast("success", `${linkType} copied to clipboard!`);
  };

  const shareViaWhatsApp = (linkToShare, defaultMessage) => {
     if (!linkToShare) {
       showToast("error", "Link not available to share.");
       return;
    }
    const text = encodeURIComponent(`${defaultMessage}: ${linkToShare}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

   const handleStartSharingPosters = () => {
     navigate('/create-poster'); // Navigate to poster creation page
   };

   // Handler for Quick Actions Navigation
   const handleQuickAction = (path) => {
       if (path) {
           navigate(path);
       } else {
           showToast('info', 'Feature coming soon!');
       }
   };

  const showToast = (type, message) => {
    const options = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };
    toast[type](message, options); // Use bracket notation for dynamic type
  };


  // --- Data for Quick Actions ---
  const quickActions = [
      { id: 'market', label: 'Market App', icon: <QuickMarketIcon />, path: '/marketing-tools' },
      { id: 'poll', label: 'Create Polls', icon: <PollIcon />, path: '/create-poll' },
      { id: 'refer', label: 'Help a Friend', icon: <HelpFriendIcon />, path: '/referral' },
      { id: 'notify', label: 'Send Alert', icon: <NotificationIcon />, path: '/send-notification' },
      // Add more actions here if needed
  ];


  // --- Render ---

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ffded5]">
      <Navbar />
      <div className="pt-20 pb-10 px-4 max-w-2xl mx-auto space-y-8"> {/* Increased space-y */}

        {/* --- 1. Website Promotion Card --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Grow big with your new Website!</h2>
            <p className="text-gray-600 mb-4">
              Checkout your newly launched website & share it with just 1-click!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.open(websiteUrl, '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm shadow"
              >
                <ExternalLinkIcon /> Open Website
              </button>
              <button
                onClick={() => shareViaWhatsApp(websiteUrl, "Check out my website")}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm shadow"
              >
                <WhatsAppIcon /> Share Website
              </button>
            </div>
          </div>
        </div>

        {/* --- 2. Quick Actions Section --- */}
        <div>
           <h2 className="text-lg font-semibold text-gray-700 mb-3 px-1">Quick Actions</h2>
           <div className="grid grid-cols-4 gap-3 md:gap-4">
              {quickActions.map((action) => (
                 <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.path)}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-peach-300 focus:ring-offset-1"
                    aria-label={action.label}
                 >
                    <span className="text-peach-500 mb-1.5">{action.icon}</span>
                    <span className="text-xs font-medium text-center text-gray-600">{action.label}</span>
                 </button>
              ))}
           </div>
        </div>

        {/* --- 3. Market Your App / Create Posters Card --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center p-6">
             <div className="mr-4 flex-shrink-0">
                <MarketingIcon /> {/* Specific icon for this card */}
             </div>
             <div>
               <h2 className="text-xl font-semibold text-gray-800 mb-2">Market your app</h2>
               <p className="text-gray-600 mb-4">
                 Create & share posters to bring more students to your app!
               </p>
               <button
                 onClick={handleStartSharingPosters}
                 className="flex items-center gap-2 bg-gradient-to-r from-peach-400 to-peach-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow"
               >
                 <ShareIcon /> Start Sharing Posters
               </button>
             </div>
          </div>
        </div>

        {/* --- 4. Share Specific Content Card (Only if content exists) --- */}
        {sharedContent && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-peach-400 to-peach-500 p-4">
              <h1 className="text-xl font-bold text-white">Share this Content</h1> {/* Slightly smaller heading */}
              <p className="text-white/90 text-sm">Share this specific item easily.</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Preview:</label>
              <div className="mb-4 bg-gray-100 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 break-words max-h-40 overflow-y-auto">
                {sharedContent}
              </div>
              {/* Link Sharing Options */}
              <div className="flex flex-wrap gap-3 justify-start mb-5">
                 <button
                    onClick={() => window.open(contentShareLink, '_blank', 'noopener,noreferrer')}
                    disabled={!contentShareLink}
                    title="Open link in new tab"
                    className={`flex items-center gap-1.5 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors text-xs font-medium shadow-sm ${!contentShareLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ExternalLinkIcon /> Open
                  </button>
                 <button
                   onClick={() => shareViaWhatsApp(contentShareLink, "Check out this content")}
                   disabled={!contentShareLink}
                   title="Share link via WhatsApp"
                   className={`flex items-center gap-1.5 bg-green-100 text-green-600 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors text-xs font-medium shadow-sm ${!contentShareLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <WhatsAppIcon /> WhatsApp
                 </button>
                 <button
                   onClick={() => copyToClipboard(contentShareLink, "Content link")}
                   disabled={!contentShareLink}
                   title="Copy link to clipboard"
                   className={`flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium shadow-sm ${!contentShareLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <CopyLinkIcon /> Copy Link
                 </button>
              </div>

               {/* Direct Share Section */}
               <hr className="my-4 border-t border-gray-200"/>
               <h3 className="text-md font-semibold text-gray-700 mb-3">Or share directly in-app:</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                   <div>
                       <label className="block text-xs font-medium text-gray-600 mb-1">Recipient Type:</label>
                       <div className="flex gap-2">
                         {["tutor", "student"].map((type) => (
                           <button
                             key={type}
                             className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                               recipientType === (type === 'student' ? 'users' : 'tutor')
                                 ? "bg-peach-500 border-peach-500 text-white"
                                 : "bg-white border-gray-300 text-gray-700 hover:border-peach-400 hover:text-peach-500"
                             }`}
                             onClick={() => setRecipientType(type === 'student' ? 'users' : 'tutor')}
                           >
                             {type.charAt(0).toUpperCase() + type.slice(1)}
                           </button>
                         ))}
                       </div>
                   </div>
                   <div>
                     <label htmlFor="recipientId" className="block text-xs font-medium text-gray-600 mb-1">
                       Recipient ID:
                     </label>
                     <input
                       id="recipientId"
                       type="text"
                       value={selectedRecipient}
                       onChange={(e) => setSelectedRecipient(e.target.value)}
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-peach-300 focus:border-transparent text-sm"
                       placeholder={`Enter ${recipientType === 'tutor' ? 'Tutor' : 'Student'} ID`}
                     />
                   </div>
               </div>
               <div className="mb-4">
                 <label htmlFor="shareMessage" className="block text-xs font-medium text-gray-600 mb-1">
                   Message (Optional):
                 </label>
                 <textarea
                   id="shareMessage"
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-peach-300 focus:border-transparent text-sm"
                   placeholder="Add a personal message..."
                   rows={2}
                 />
               </div>
               <button
                 onClick={handleDirectShare}
                 disabled={!selectedRecipient || !currentUser}
                 className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-peach-400 to-peach-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                 <ShareIcon /> Send to {recipientType === 'tutor' ? 'Tutor' : 'Student'}
               </button>
            </div>
          </div>
        )}

        {/* --- 5. Increase App Downloads / General Promotion Card --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Increase your app downloads</h2>
            <p className="text-gray-600 mb-4">Share the app link to grow your audience.</p>
            <div className="flex flex-wrap gap-3">
              <button
                 onClick={() => shareViaWhatsApp(appShareLink, "Check out this app")}
                 className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm shadow"
               >
                 <WhatsAppIcon /> Share App Link
               </button>
               <button
                 onClick={() => copyToClipboard(appShareLink, "App link")}
                 className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm shadow"
               >
                 <CopyLinkIcon /> Copy App Link
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Share;