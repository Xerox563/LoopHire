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
    <div className="glass-card !p-6 lg:!p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Identity Matrix</h3>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-lg bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsEditing(false);
                setTempProfile(profile);
              }}
              className="p-2.5 rounded-lg bg-white/5 text-text-muted hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSave}
              className="p-2.5 rounded-lg bg-accent text-white shadow-lg shadow-accent/20 transition-all"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="text" 
                value={isEditing ? tempProfile.firstName : profile.firstName}
                onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="text" 
                value={isEditing ? tempProfile.lastName : profile.lastName}
                onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Email Node</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="email" 
                value={isEditing ? tempProfile.email : profile.email}
                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Neural Comms (Phone)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="text" 
                value={isEditing ? tempProfile.phone : profile.phone}
                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Location Sync</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="text" 
                value={isEditing ? tempProfile.currentLocation : profile.currentLocation}
                onChange={(e) => setTempProfile({ ...tempProfile, currentLocation: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Web Portals (LinkedIn/GitHub)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="LinkedIn"
                  value={isEditing ? tempProfile.linkedinUrl : profile.linkedinUrl}
                  onChange={(e) => setTempProfile({ ...tempProfile, linkedinUrl: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
                />
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="GitHub"
                  value={isEditing ? tempProfile.githubUrl : profile.githubUrl}
                  onChange={(e) => setTempProfile({ ...tempProfile, githubUrl: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experience & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">XP Years</label>
            <div className="relative">
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="text" 
                value={isEditing ? tempProfile.yearsOfExperience : profile.yearsOfExperience}
                onChange={(e) => setTempProfile({ ...tempProfile, yearsOfExperience: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Salary Sync ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">$</span>
              <input 
                type="text" 
                value={isEditing ? tempProfile.desiredSalary : profile.desiredSalary}
                onChange={(e) => setTempProfile({ ...tempProfile, desiredSalary: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>
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
