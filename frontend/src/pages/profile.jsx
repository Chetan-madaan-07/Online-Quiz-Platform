import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePhoto: "",
    gender: "",
    age: "",
    bio: "",
  });

  // Load user data on mount
  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    // Initialize with user data from context
    setFormData({
      name: user.name || "",
      email: user.email || "",
      profilePhoto: user.profilePhoto || "",
      gender: user.gender || "",
      age: user.age || "",
      bio: user.bio || "",
    });

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const userData = data.user;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            profilePhoto: userData.profilePhoto || "",
            gender: userData.gender || "",
            age: userData.age || "",
            bio: userData.bio || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      // Compress image before converting to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to compress image
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression (0.8 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          setFormData((prev) => ({
            ...prev,
            profilePhoto: compressedBase64,
          }));
          setError(""); // Clear any previous errors
        };
        img.onerror = () => {
          setError("Failed to load image");
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        navigate("/signin");
        return;
      }

      // Prepare update data - handle empty strings properly
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        profilePhoto: formData.profilePhoto || "",
        gender: formData.gender || "",
        age: formData.age === "" || formData.age === null ? null : formData.age,
        bio: formData.bio || "",
      };

      // Validate required fields
      if (!updateData.name) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      if (!updateData.email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      // Validate age if provided
      if (updateData.age !== null && updateData.age !== "") {
        const ageNum = parseInt(updateData.age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          setError("Age must be a number between 1 and 120");
          setLoading(false);
          return;
        }
        updateData.age = ageNum;
      }

      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError("Server returned an invalid response");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      // Update user in context and localStorage
      const updatedUser = {
        ...user,
        ...data.user,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePhoto: user.profilePhoto || "",
        gender: user.gender || "",
        age: user.age || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-photo-section">
            <div className="photo-wrapper">
              <img
                src={
                  formData.profilePhoto ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(formData.name || "User") +
                    "&background=8b5cf6&color=fff&size=200"
                }
                alt="Profile"
                className="profile-photo-large"
              />
              {isEditing && (
                <label className="photo-upload-btn">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <span>📷 Change Photo</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "" : "disabled-input"}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="1"
                max="120"
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            <div className="form-group full-width">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                placeholder="Tell us about yourself..."
                className={isEditing ? "" : "disabled-input"}
              />
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;

