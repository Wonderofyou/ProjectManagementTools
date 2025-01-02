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
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900">My Invitations</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your project invitations and collaborations
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-gray-500">Total Invitations</div>
                        <div className="mt-2 text-3xl font-semibold text-gray-900">{invitations.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-gray-500">Accepted</div>
                        <div className="mt-2 text-3xl font-semibold text-green-600">
                            {invitations.filter(inv => inv.status === 'accepted').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-gray-500">Pending</div>
                        <div className="mt-2 text-3xl font-semibold text-yellow-600">
                            {invitations.filter(inv => inv.status === 'pending').length}
                        </div>
                    </div>
                </div>

                {/* Response Status */}
                {responseStatus && (
                    <div className="mb-6">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{responseStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invitations Grid */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-5 sm:p-6">
                        {invitations.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations</h3>
                                <p className="mt-1 text-sm text-gray-500">You don't have any pending invitations at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {invitations.map((invitation) => (
                                    <div 
                                        key={invitation._id}
                                        className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {invitation.project_id.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        From: <span className="font-medium text-blue-600">{invitation.inviter_id.name}</span>
                                                    </p>
                                                </div>
                                                <span className={`${getStatusBadge(invitation.status)} ml-2`}>
                                                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="mt-4 pt-4 border-t">
                                                {invitation.status === "pending" ? (
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleResponseInvite(invitation._id, "accepted")}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleResponseInvite(invitation._id, "declined")}
                                                            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={`flex items-center ${
                                                        invitation.status === "accepted" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                                d={invitation.status === "accepted" 
                                                                    ? "M5 13l4 4L19 7"
                                                                    : "M6 18L18 6M6 6l12 12"
                                                                } 
                                                            />
                                                        </svg>
                                                        {invitation.status === "accepted" 
                                                            ? "You have accepted this invitation"
                                                            : "You have declined this invitation"
                                                        }
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
            </div>
        </div>
    );
}