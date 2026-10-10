import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "./Button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import counselorServices from "../services/counselorService";

const CounselorForm = ({ categories }) => {
    const { user } = useSelector((state) => state.auth);
    console.log(user)

    const {
        data,
        isPending,
        isSuccess,
        isError,
        error,
        mutate,
    } = useMutation({
        mutationFn: (payload) => counselorServices.becomeCounselor(payload),
    });
    console.log(data)

    const [formData, setFormData] = useState({
        category: "",
        experience: "",
    });

    const { category, experience } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    console.log(formData)

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!category || !experience) {
            toast.error("Please select category and experience");
            return;
        }

        if (!user?.token) {
            toast.error("Please login again to submit application");
            return;
        }

        mutate({
            token: user.token,
            category,
            experience: Number(experience),
        });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Application submitted successfully");
            setFormData({ category: "", experience: "" });
        }

        if (isError && error) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
        }
    }, [data, isSuccess, isError, error]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Qualification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                        Full Name & Title
                    </label>

                    <input
                        type="text"
                        defaultValue={user?.name || ""}
                        placeholder="e.g. Vikramaditya Singh"
                        className="disabled:bg-gray-300 w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                        disabled
                    />
                </div>

                <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                        Qualification
                    </label>

                    <input
                        type="text"
                        defaultValue={user?.qualification || ""}
                        placeholder="e.g. M.Tech Information Technology"
                        className="disabled:bg-gray-300 w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                        disabled
                    />
                </div>

            </div>


            {/* Email + Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                        Email
                    </label>

                    <input
                        type="email"
                        defaultValue={user?.email || ""}
                        placeholder="jhon@gmail.com"
                        className="disabled:bg-gray-300 w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                        disabled
                    />
                </div>


                <div>
                    <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                        Years of Industry Experience (min 2)
                    </label>

                    <select
                        name="experience"
                        value={experience}
                        onChange={handleChange}
                        className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                    >
                        <option value="">
                            Select Experience
                        </option>

                        <option value="3">
                            3 - 5 Years
                        </option>

                        <option value="6">
                            6 - 10 Years
                        </option>

                        <option value="10">
                            10+ Years
                        </option>
                    </select>
                </div>

            </div>


            {/* Category */}
            <div>
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                    Primary Domain Expertise
                </label>

                <select
                    name="category"
                    value={category}
                    onChange={handleChange}
                    className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                >

                    <option value="">
                        Select Domain
                    </option>

                    {categories?.map((cat) => (
                        <option
                            key={cat._id}
                            value={cat._id}
                        >
                            {cat.title}
                        </option>
                    ))}

                </select>
            </div>

            {isSuccess && data?.counselor && (
                <div className="bg-teal/10 border-2 border-navy p-3 rounded-xl font-body text-xs text-navy">
                    Request status: <span className="font-bold">{data.counselor.status || "pending"}</span>.
                    Wait for admin approval.
                </div>
            )}

            {/* Submit */}
            <div className="pt-4 border-t-2 border-navy/20">

                <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    classNameName="w-full"
                >
                    {isPending ? "SUBMITTING..." : "SUBMIT COUNSELOR APPLICATION →"}
                </Button>

            </div>

        </form>
    );
};

export default CounselorForm;
