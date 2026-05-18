import { UserProfile } from "@/types";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Globe, Save, Edit2, X, Loader2 } from "lucide-react";

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
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("user_profile")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

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
          };
          setProfile(loadedProfile);
          setTempProfile(loadedProfile);
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
    const { error } = await supabase.from("user_profile").insert({
      first_name: tempProfile.firstName,
      last_name: tempProfile.lastName,
      email: tempProfile.email,
      phone: tempProfile.phone,
      linkedin_url: tempProfile.linkedinUrl,
      current_location: tempProfile.currentLocation,
      portfolio_url: tempProfile.portfolioUrl,
      github_url: tempProfile.githubUrl,
    });

    if (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile changes");
      return;
    }

    setProfile(tempProfile);
    setIsEditing(false);
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Personal Details
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-all"
          >
            <Edit2 className="w-3 h-3" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/20 border border-success/30 text-xs font-bold uppercase tracking-widest text-success hover:bg-success/30 transition-all"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={() => {
                setTempProfile(profile);
                setIsEditing(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-all"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label="LinkedIn URL"
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
          label="Portfolio URL"
          icon={Globe}
          value={isEditing ? tempProfile.portfolioUrl : profile.portfolioUrl}
          onChange={(v: string) => setTempProfile({ ...tempProfile, portfolioUrl: v })}
          isEditing={isEditing}
          placeholder="johndoe.com"
        />
        <InputGroup
          label="GitHub URL"
          icon={Globe}
          value={isEditing ? tempProfile.githubUrl : profile.githubUrl}
          onChange={(v: string) => setTempProfile({ ...tempProfile, githubUrl: v })}
          isEditing={isEditing}
          placeholder="github.com/johndoe"
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
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-all"
        />
      ) : (
        <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-text-secondary min-h-[42px] flex items-center">
          {value || <span className="italic opacity-30">Not provided</span>}
        </div>
      )}
    </div>
  );
}
