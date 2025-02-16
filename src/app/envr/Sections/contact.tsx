"use client";
import { customToast } from "@/components/ui/customToast";
import { encryptString } from "@/utils/enc-utils";
import { isHtmlTagPresent } from "@/utils/input-utils";
import axios from "axios";
import React, { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key in keyof FormData]?: string } = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (/^\s+$/.test(formData.fullName)) {
      newErrors.fullName = "Blank spaces are not allowed.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (/^\s+$/.test(formData.message)) {
      newErrors.message = "Blank spaces are not allowed.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Prepare POST data
    const postData = {
      name: formData.fullName,
      email: formData.email,
      query: formData.message,
      phone_number: formData.phone,
    };

    if (isHtmlTagPresent(postData)) {
      customToast.error("Invalid Input!");
      return;
    }
    try {
      const requestBody = postData
      let encryptedPayload = {};
      if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
        encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/auth/customer-inquiry`,
        { data: encryptedPayload }
      );
      console.log("Response:", response.data);
      customToast.success("Your query has been submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      customToast.error("Failed to submit your query. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    if (id === "phone") {
      // Only allow numeric values and limit to 10 digits
      const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData({ ...formData, [id]: sanitizedValue });

      if (sanitizedValue.length < 10) {
        setErrors({ ...errors, phone: "Phone number must be exactly 10 digits." });
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors.phone;
        setErrors(updatedErrors);
      }
    } else if (id === "email") {
      // Validate email format
      setFormData({ ...formData, [id]: value });

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(value)) {
        setErrors({ ...errors, email: "Invalid email address." });
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors.email;
        setErrors(updatedErrors);
      }
    } else if (id === "fullName") {
      // Allow only up to 100 words
      const wordCount = value.trim().length;
      console.log(wordCount)
      if (wordCount > 30) {
        setErrors({ ...errors, fullName: "Full name cannot exceed 30 words." });
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors.fullName;
        setErrors(updatedErrors);
      }
      setFormData({ ...formData, [id]: value.slice(0, 30) });
    } else {
      // For other fields, update without validation
      setFormData({ ...formData, [id]: value });
    }

    console.log("handleChange:", id, value);
  };


  return (
    <div id="contact-us" className="h-auto bg-[#f3f4f6]  scroll-mt-[87px] mt-8  pt-[50px]">
      <div className=" flex items-center justify-center lg:p-4 ">
        <div className="w-full  flex flex-col lg:flex-row overflow-hidden rounded-[30px] bg-white px-[24px] py-[36px] ">
          <div className="bg-gray-50 p-8 lg:w-1/2 rounded-[30px] lg:px-[99px] lg:py-[62px] ">
            <div className="mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-brand1-500 rounded-full"></div>
                <p className="font-[500] text-[18px] font-inter text-black">
                  Contact us
                </p>
              </div>
              <h1 className="text-[45px] font-[400] font-inter text-[#000] mt-2">
                Get in touch
              </h1>
            </div>
            <div className="mt-6">
              <h3 className="text-[30px] font-[500] font-inter text-[#000] mt-2">
                Compliance Kart Pvt. Ltd.
              </h3>
              <p className="mt-4 text-[18px] text-[#000] font-[500] font-inter">
                B1002, 10th Floor, Advant Navis <br /> Business Park, Sector
                142,
                <br /> Noida, Uttar Pradesh
              </p>
              <p className="mt-8 text-[18px] text-[#000] font-[500] font-inter">
                Phone: +91 9818433987
              </p>
              <p className="mt-2 text-[18px] text-[#000] font-[500] font-inter">
                Email: connect@compliancekart.io
              </p>
            </div>
          </div>

          <div className="lg:p-8 lg:w-1/2 mt-8 lg-mt-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block text-[#000] font-[500] text-[18px] font-inter"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border text-black border-[#E6E7E8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#57CC99]"
                />
                {errors.fullName && (
                  <p className="text-negativeBold text-[12px] mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-[#000] font-[500] text-[18px] font-inter"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border text-black border-[#E6E7E8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#57CC99]"
                />
                {errors.email && (
                  <p className="text-negativeBold text-[12px] mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-[#000] font-[500] text-[18px] font-inter"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-[#E6E7E8] text-black rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#57CC99]"
                />
                {errors.phone && (
                  <p className="text-negativeBold text-[12px] mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-[#000] font-[500] text-[18px] font-inter"
                  htmlFor="message"
                >
                  Message/Query
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message/query"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={2000}
                  className="w-full mt-2 p-3 border text-black border-[#E6E7E8] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#57CC99] resize-none"
                ></textarea>
                {errors.message && (
                  <p className="text-negativeBold text-[12px] mt-1">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="font-inter bg-black text-white py-3 px-8 rounded-[42px] text-sm lg:text-base shadow-md hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;