import React, { useState } from "react";

export default function FeedbackForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        alert("✅ Feedback submitted!");
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(to right, #a73b24, #8b2f1a)' }}>
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Feedback Form
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                            onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px #a73b24'}
                            onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = ''}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                            onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px #a73b24'}
                            onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = ''}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Subject:</label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Enter subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                            onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px #a73b24'}
                            onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = ''}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Message:</label>
                        <textarea
                            name="message"
                            placeholder="Enter message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 resize-none"
                            onFocus={(e) => (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 2px #a73b24'}
                            onBlur={(e) => (e.target as HTMLTextAreaElement).style.boxShadow = ''}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full text-white py-3 rounded-full font-semibold transition cursor-pointer"
                        style={{ backgroundColor: '#a73b24' }}
                        onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#8b2f1a'}
                        onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#a73b24'}
                    >
                        Submit →
                    </button>
                </div>
            </div>
        </div>
    );
}