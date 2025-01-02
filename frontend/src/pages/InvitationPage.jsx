import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InvitationPage() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseStatus, setResponseStatus] = useState("");  // Dùng để hiển thị thông báo phản hồi

    // Fetch all invitations
    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axios.get('/v1/user/invitations');
                setInvitations(response.data.invitations);
                setLoading(false);
            } catch (err) {
                setError('Error fetching invitations');
                setLoading(false);
            }
        };
        fetchInvitations();
    }, []);

    // Handle response to invitation
    const handleResponseInvite = async (invitationId, status) => {
        try {
            // Gửi phản hồi cho lời mời
            const response = await axios.post(
                '/v1/user/response-invitation',
                { invitationId, status }
            );

            // Hiển thị thông báo trạng thái phản hồi
            setResponseStatus(`You have ${status} the invitation.`);

            // Cập nhật lại trạng thái lời mời sau khi phản hồi
            setInvitations((prevInvitations) =>
                prevInvitations.map((invitation) =>
                    invitation._id === invitationId
                        ? { ...invitation, status } // Cập nhật trạng thái lời mời đã phản hồi
                        : invitation
                )
            );
        } catch (error) {
            setResponseStatus('Error responding to invitation');
        }
    };

    // Enhanced loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Enhanced error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-lg text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700",
            accepted: "bg-green-100 text-green-700",
            declined: "bg-red-100 text-red-700",
            rejected: "bg-red-100 text-red-700"
        };
        return `${styles[status]} px-3 py-1 rounded-full text-sm font-medium`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Invitations</h1>
                
                {responseStatus && (
                    <div className="mb-6 animate-fade-in">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-green-700">{responseStatus}</p>
                        </div>
                    </div>
                )}

                {invitations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <p className="text-gray-500">No invitations found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {invitations.map((invitation) => (
                            <div 
                                key={invitation._id} 
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                                {invitation.project_id.name}
                                            </h2>
                                            <p className="text-gray-600">
                                                <span className="font-medium text-blue-600">
                                                    {invitation.inviter_id.name}
                                                </span>
                                                <span className="mx-2">invited you</span>
                                            </p>
                                        </div>
                                        <span className={getStatusBadge(invitation.status)}>
                                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        {invitation.status === "pending" && (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleResponseInvite(invitation._id, "accepted")}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleResponseInvite(invitation._id, "declined")}
                                                    className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                        {invitation.status === "accepted" && (
                                            <div className="text-green-500 font-medium flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                You have accepted this invitation
                                            </div>
                                        )}
                                        {(invitation.status === "rejected" || invitation.status === "declined") && (
                                            <div className="text-red-500 font-medium flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                You have declined this invitation
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}