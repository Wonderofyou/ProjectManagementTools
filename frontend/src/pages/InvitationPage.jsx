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

    // Loading and error handling
    if (loading) {
        return <div>Loading invitations...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-full max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Invitations</h1>
                {responseStatus && <div className="mb-4 text-green-500">{responseStatus}</div>}

                {invitations.length === 0 ? (
                    <p>No invitations found</p>
                ) : (
                    <ul className="space-y-4">
                        {invitations.map((invitation) => (
                            <li key={invitation._id} className="border p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold">{invitation.project_id.name}</h2>
                                    <span className="text-gray-500">Status: {invitation.status}</span>
                                </div>
                                <p className="text-gray-700">{invitation.inviter_id.name} invited you</p>
                                <div className="mt-4 flex space-x-4">
                                    {invitation.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleResponseInvite(invitation._id, "accepted")}
                                                className="bg-green-500 text-white py-2 px-4 rounded"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleResponseInvite(invitation._id, "declined")}
                                                className="bg-red-500 text-white py-2 px-4 rounded"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {invitation.status === "accepted" && (
                                        <span className="text-green-500">You have accepted this invitation</span>
                                    )}
                                    {invitation.status === "rejected" && (
                                        <span className="text-red-500">You have rejected this invitation</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
