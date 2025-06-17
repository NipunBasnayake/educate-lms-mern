import React, { useState } from "react";

const DiscussionsTab = () => {
  // const [discussions, setDiscussions] = useState([
  //   {
  //     id: 1,
  //     title: "Question about assignment 1",
  //     author: "You",
  //     replies: 3,
  //     content: "I'm having trouble with question 3 in assignment 1. Can anyone help?",
  //   },
  //   {
  //     id: 2,
  //     title: "Lecture notes clarification",
  //     author: "You",
  //     replies: 5,
  //     content: "Could someone explain the concept from slide 15 in more detail?",
  //   },
  // ]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [newDiscussion, setNewDiscussion] = useState({
  //   title: "",
  //   content: "",
  // });
  // const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  // const [replyMessage, setReplyMessage] = useState("");

  // const handleCreateDiscussion = () => {
  //   if (!newDiscussion.title || !newDiscussion.content) return;
    
  //   const discussion = {
  //     id: discussions.length + 1,
  //     title: newDiscussion.title,
  //     author: "You",
  //     replies: 0,
  //     content: newDiscussion.content,
  //   };
    
  //   setDiscussions([discussion, ...discussions]);
  //   setNewDiscussion({ title: "", content: "" });
  //   setIsModalOpen(false);
  // };

  // const handleDiscussionClick = (discussion) => {
  //   setSelectedDiscussion(discussion);
  // };

  // const handleBackToList = () => {
  //   setSelectedDiscussion(null);
  // };

  // const handleReplySubmit = (e) => {
  //   e.preventDefault();
  //   if (!replyMessage.trim()) return;
    
  //   // In a real app, you would update the discussion with the new reply
  //   // For now, we'll just update the reply count
  //   const updatedDiscussions = discussions.map(d => 
  //     d.id === selectedDiscussion.id 
  //       ? { ...d, replies: d.replies + 1 } 
  //       : d
  //   );
    
  //   setDiscussions(updatedDiscussions);
  //   setSelectedDiscussion({...selectedDiscussion, replies: selectedDiscussion.replies + 1});
  //   setReplyMessage("");
  // };

  return (
    // <div className="p-4">
    //   {selectedDiscussion ? (
    //     // Chat box view
    //     <div className="border border-gray-200 rounded-lg p-4">
    //       <button 
    //         onClick={handleBackToList}
    //         className="mb-4 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
    //       >
    //         ← Back to discussions
    //       </button>
          
    //       <div className="mb-6">
    //         <h2 className="text-xl font-semibold mb-2">{selectedDiscussion.title}</h2>
    //         <p className="text-sm text-gray-500 mb-3">Posted by {selectedDiscussion.author}</p>
    //         <div className="bg-gray-50 p-4 rounded-md mb-4">
    //           <p>{selectedDiscussion.content}</p>
    //         </div>
    //       </div>
          
    //       {/* Replies section */}
    //       <div className="mb-6">
    //         <h3 className="font-medium mb-3">Replies ({selectedDiscussion.replies})</h3>
    //         <div className="space-y-3">
    //           {/* Sample replies - in a real app these would come from the discussion data */}
    //           {selectedDiscussion.replies > 0 && (
    //             <>
    //               <div className="bg-gray-50 p-3 rounded-md">
    //                 <p className="text-sm text-gray-500 mb-1">Lecture</p>
    //                 <p> Good question — Slide 15 focuses on the concept of module resolution in Vite. This involves how Vite locates and optimizes dependencies during development and build time.</p>
    //               </div>
    //               <div className="bg-gray-50 p-3 rounded-md">
    //                 <p className="text-sm text-gray-500 mb-1">Lecture</p>
    //                 <p>Here's a code example that might help: [example]</p>
    //               </div>
    //             </>
    //           )}
    //           {selectedDiscussion.replies === 0 && (
    //             <p className="text-gray-500">No replies yet. Be the first to respond!</p>
    //           )}
    //         </div>
    //       </div>
          
    //       {/* Reply form */}
    //       <form onSubmit={handleReplySubmit}>
    //         <textarea
    //           value={replyMessage}
    //           onChange={(e) => setReplyMessage(e.target.value)}
    //           className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
    //           rows={3}
    //           placeholder="Write your reply..."
    //         />
    //         <button
    //           type="submit"
    //           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    //         >
    //           Post Reply
    //         </button>
    //       </form>
    //     </div>
    //   ) : (
    //     // Discussions list view
    //     <>
    //       <div className="flex justify-between items-center mb-6">
    //         <h2 className="text-xl font-semibold text-gray-900">Discussions</h2>
    //         <button
    //           onClick={() => setIsModalOpen(true)}
    //           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    //         >
    //           New Discussion
    //         </button>
    //       </div>

    //       <div className="space-y-4">
    //         {discussions.map((discussion) => (
    //           <div
    //             key={discussion.id}
    //             onClick={() => handleDiscussionClick(discussion)}
    //             className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
    //           >
    //             <h3 className="font-medium text-gray-900 hover:text-indigo-600">
    //               {discussion.title}
    //             </h3>
    //             <div className="flex justify-between mt-2">
    //               <p className="text-sm text-gray-500">
    //                 Posted by {discussion.author}
    //               </p>
    //               <p className="text-sm text-gray-500">
    //                 {discussion.replies} replies
    //               </p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* New Discussion Modal */}
    //       {isModalOpen && (
    //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
    //             <h3 className="text-lg font-medium mb-4">New Discussion</h3>
                
    //             <div className="space-y-4">
    //               <div>
    //                 <label className="block text-sm font-medium text-gray-700 mb-1">
    //                   Title
    //                 </label>
    //                 <input
    //                   type="text"
    //                   value={newDiscussion.title}
    //                   onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
    //                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
    //                   placeholder="Enter discussion title"
    //                 />
    //               </div>
                  
    //               <div>
    //                 <label className="block text-sm font-medium text-gray-700 mb-1">
    //                   Content
    //                 </label>
    //                 <textarea
    //                   value={newDiscussion.content}
    //                   onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
    //                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
    //                   rows={4}
    //                   placeholder="Enter your question or topic"
    //                 />
    //               </div>
    //             </div>

    //             <div className="mt-6 flex justify-end space-x-3">
    //               <button
    //                 onClick={() => setIsModalOpen(false)}
    //                 className="px-4 py-2 border border-gray-300 rounded-md"
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 onClick={handleCreateDiscussion}
    //                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    //               >
    //                 Post Discussion
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </>
    //   )}
    // </div>
    <div>Chat component</div>
  );
};

export default DiscussionsTab;