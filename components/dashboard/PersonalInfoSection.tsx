import { UserProfile } from "@/types";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Globe, Save, Edit2, X, Loader2, Activity } from "lucide-react";

export default function PersonalInfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    currentLocation: "",
    portfolioUrl: "",
    githubUrl: "",
    yearsOfExperience: "",
    desiredSalary: "",
    usWorkAuthorization: "",
    requiresSponsorship: "",
    resumeFilePath: "",
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "user_profile",
            action: "select",
            data: "*"
          })
        });

        if (response.ok) {
          const { data: profiles } = await response.json();
          const data = Array.isArray(profiles) ? profiles.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0] : null;

          if (data) {
            const loadedProfile = {
              firstName: data.first_name || "",
              lastName: data.last_name || "",
              email: data.email || "",
              phone: data.phone || "",
              linkedinUrl: data.linkedin_url || "",
              currentLocation: data.current_location || "",
              portfolioUrl: data.portfolio_url || "",
              githubUrl: data.github_url || "",
              yearsOfExperience: data.years_of_experience || "",
              desiredSalary: data.desired_salary || "",
              usWorkAuthorization: data.us_work_authorization || "",
              requiresSponsorship: data.requires_sponsorship || "",
              resumeFilePath: data.resume_file_path || "",
            };
            setProfile(loadedProfile);
            setTempProfile(loadedProfile);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    const response = await fetch("/api/db", {
      method: "POST",
      body: JSON.stringify({
        table: "user_profile",
        action: "insert",
        data: {
          first_name: tempProfile.firstName,
          last_name: tempProfile.lastName,
          email: tempProfile.email,
          phone: tempProfile.phone,
          linkedin_url: tempProfile.linkedinUrl,
          current_location: tempProfile.currentLocation,
          portfolio_url: tempProfile.portfolioUrl,
          github_url: tempProfile.githubUrl,
          years_of_experience: tempProfile.yearsOfExperience,
          desired_salary: tempProfile.desiredSalary,
          us_work_authorization: tempProfile.usWorkAuthorization,
          requires_sponsorship: tempProfile.requiresSponsorship,
          resume_file_path: tempProfile.resumeFilePath,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to save profile:", error);
      alert("Failed to save profile changes");
      return;
    }

    setProfile(tempProfile);
    setIsEditing(false);
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto" />;

  return (
    <div className="glass-card !p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <User className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">Identity Details</h3>
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Personal Parameters</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/10 transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Modify
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-success/20 border border-success/30 text-[11px] font-bold uppercase tracking-widest text-success hover:bg-success/30 transition-all shadow-lg shadow-success/10"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setTempProfile(profile);
                setIsEditing(false);
              }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InputGroup
          label="First Name"
          icon={User}
          value={isEditing ? tempProfile.firstName : profile.firstName}
          onChange={(v: string) => setTempProfile({ ...tempProfile, firstName: v })}
          isEditing={isEditing}
          placeholder="John"
        />
        <InputGroup
          label="Last Name"
          icon={User}
          value={isEditing ? tempProfile.lastName : profile.lastName}
          onChange={(v: string) => setTempProfile({ ...tempProfile, lastName: v })}
          isEditing={isEditing}
          placeholder="Doe"
        />
        <InputGroup
          label="Email Address"
          icon={Mail}
          value={isEditing ? tempProfile.email : profile.email}
          onChange={(v: string) => setTempProfile({ ...tempProfile, email: v })}
          isEditing={isEditing}
          placeholder="john@example.com"
        />
        <InputGroup
          label="Phone Number"
          icon={Phone}
          value={isEditing ? tempProfile.phone : profile.phone}
          onChange={(v: string) => setTempProfile({ ...tempProfile, phone: v })}
          isEditing={isEditing}
          placeholder="+1 (555) 000-0000"
        />
        <InputGroup
          label="LinkedIn Network"
          icon={Globe}
          value={isEditing ? tempProfile.linkedinUrl : profile.linkedinUrl}
          onChange={(v: string) => setTempProfile({ ...tempProfile, linkedinUrl: v })}
          isEditing={isEditing}
          placeholder="linkedin.com/in/johndoe"
        />
        <InputGroup
          label="Current Location"
          icon={MapPin}
          value={isEditing ? tempProfile.currentLocation : profile.currentLocation}
          onChange={(v: string) => setTempProfile({ ...tempProfile, currentLocation: v })}
          isEditing={isEditing}
          placeholder="San Francisco, CA"
        />
        <InputGroup
          label="Portfolio / Site"
          icon={Globe}
          value={isEditing ? tempProfile.portfolioUrl : profile.portfolioUrl}
          onChange={(v: string) => setTempProfile({ ...tempProfile, portfolioUrl: v })}
          isEditing={isEditing}
          placeholder="johndoe.com"
        />
        <InputGroup
          label="GitHub Profile"
          icon={Globe}
          value={isEditing ? tempProfile.githubUrl : profile.githubUrl}
          onChange={(v: string) => setTempProfile({ ...tempProfile, githubUrl: v })}
          isEditing={isEditing}
          placeholder="github.com/johndoe"
        />
        <InputGroup
          label="Years of Experience"
          icon={Activity}
          value={isEditing ? tempProfile.yearsOfExperience || "" : profile.yearsOfExperience || ""}
          onChange={(v: string) => setTempProfile({ ...tempProfile, yearsOfExperience: v })}
          isEditing={isEditing}
          placeholder="5"
        />
        <InputGroup
          label="Target Salary"
          icon={Globe}
          value={isEditing ? tempProfile.desiredSalary || "" : profile.desiredSalary || ""}
          onChange={(v: string) => setTempProfile({ ...tempProfile, desiredSalary: v })}
          isEditing={isEditing}
          placeholder="$150,000"
        />
        <InputGroup
          label="US Work Auth"
          icon={Globe}
          value={isEditing ? tempProfile.usWorkAuthorization || "" : profile.usWorkAuthorization || ""}
          onChange={(v: string) => setTempProfile({ ...tempProfile, usWorkAuthorization: v })}
          isEditing={isEditing}
          placeholder="Yes / No"
        />
        <InputGroup
          label="Sponsorship Req."
          icon={Globe}
          value={isEditing ? tempProfile.requiresSponsorship || "" : profile.requiresSponsorship || ""}
          onChange={(v: string) => setTempProfile({ ...tempProfile, requiresSponsorship: v })}
          isEditing={isEditing}
          placeholder="Yes / No"
        />
      </div>
    </div>
  );
}

function InputGroup({ label, icon: Icon, value, onChange, isEditing, placeholder }: {
  label: string;
  icon: any;
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  placeholder: string;
}) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1">
        <Icon className="w-3.5 h-3.5 text-accent/50" />
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
        />
      ) : (
        <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 text-sm text-text-secondary min-h-[52px] flex items-center font-medium italic">
          {value || <span className="opacity-30">Not specified</span>}
        </div>
      )}
    </div>
  );
}
