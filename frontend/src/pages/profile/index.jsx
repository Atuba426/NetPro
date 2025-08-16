import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import { BASE_URL, clientServer } from "@/config";
import styles from "./index.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPosts } from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";
import { deleteEducation } from "@/config/redux/action/authAction";
import { deletePastWork } from "@/config/redux/action/authAction";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  const [userPost, setuserPost] = useState([]);
  const [userProfile, setUserprofile] = useState({});
  const [isWorkModaalOpen, setIsWorkModaalOpen] = useState(false);
  const [isEduModaalOpen, setIsEduModaalOpen] = useState(false);
  const [isProfileModified, setIsProfileModified] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [inputData1, setInputData1] = useState({
    school: "",
    degree: "",
    typeOfStudy: "",
  });

  const handleInputChangeEducation = (e) => {
    const { name, value } = e.target;
    setInputData1({ ...inputData1, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserprofile(authState.user);
    }
  }, [authState.user]);

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === authState.user.userId.username;
    });
    setuserPost(post);
  }, [postReducer.posts]);

  const profilePictureUpdate = async (file) => {
    if (!file) {
      console.warn("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  // This function now correctly accepts the updatedData object
  const updateProfileData = async (updatedData) => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: updatedData.userId.name,
    });
    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: updatedData.bio,
      currentPost: updatedData.currentPost,
      pastWork: updatedData.pastWork,
      education: updatedData.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backdrop_Container}>
              <div className={styles.backDrop_overlay}>
                <label htmlFor="profilePictureUpdate">
                  <p>Edit</p>
                </label>
                <input
                  onChange={(e) => profilePictureUpdate(e.target.files[0])}
                  hidden
                  type="file"
                  id="profilePictureUpdate"
                />
              </div>
              <img
                className={styles.backdrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt="Profile Pic"
              />
            </div>
            <div className={styles.profileContainer_Details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "fit-content",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserprofile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                        setIsProfileModified(true);
                      }}
                    />
                    <p style={{ color: "grey" }}>
                      @
                      <span
                        contentEditable
                        suppressContentEditableWarning={true}
                      >
                        {userProfile.userId.username}
                      </span>
                    </p>
                  </div>
                  <div>
                    <textarea
                      placeholder="Write a Catchy Bio"
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserprofile({ ...userProfile, bio: e.target.value });
                        setIsProfileModified(true);
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    ></textarea>
                  </div>
                </div>
                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPost.map((post) => (
                    <div key={post._id} className={styles.postsCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work History Section */}
            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p style={{ fontWeight: "bold" }}>
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                    <div className={styles.cross_btn}
                      onClick={() => {
                        const updatedPastWork = userProfile.pastWork.filter(
                          (w) => w._id !== work._id
                        );
                        setUserprofile({
                          ...userProfile,
                          pastWork: updatedPastWork,
                        });
                        setIsProfileModified(true);
                      }}
                     
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                    </div>
                  </div>
                ))}
                <button
                  className={styles.addWorkButton}
                  onClick={() => setIsWorkModaalOpen(true)}
                >
                  Add Work
                </button>
              </div>
            </div>

            {/* Education Section */}
            <div className={styles.workHistory}>
              <h4>Education</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.education.map((edu, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p style={{ fontWeight: "bold" }}>{edu.school}</p>
                    <p>{edu.degree}</p>
                    <p>{edu.typeOfStudy}</p>
                    <div className={styles.cross_btn}
                      onClick={() => {
                        const updatedEducation = userProfile.education.filter(
                          (e) => e._id !== edu._id
                        );
                        setUserprofile({
                          ...userProfile,
                          education: updatedEducation,
                        });
                        setIsProfileModified(true);
                      }}
                      
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                    </div>
                  </div>
                ))}
                <button
                  className={styles.addWorkButton}
                  onClick={() => setIsEduModaalOpen(true)}
                >
                  Add Education
                </button>
              </div>
            </div>
            {isProfileModified && (
              <div
                onClick={async () => {
                  await updateProfileData(userProfile);
                  setIsProfileModified(false); // Reset to false after saving
                }}
                className={styles.updateProfile_btn}
              >
                Update Profile
              </div>
            )}
          </div>
        )}
        {/* Work Modal */}
        {isWorkModaalOpen && (
          <div
            onClick={() => setIsWorkModaalOpen(false)}
            className={styles.commentsContainer}
          >
            <div
              className={styles.commentBoxWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.allCommentsContainer}>
                <input
                  onChange={handleInputChange}
                  name="company"
                  className={styles.inputFeild}
                  type="text"
                  placeholder="Enter Company"
                />
                <input
                  onChange={handleInputChange}
                  name="position"
                  className={styles.inputFeild}
                  type="text"
                  placeholder="Enter Position"
                />
                <input
                  onChange={handleInputChange}
                  name="years"
                  className={styles.inputFeild}
                  type="number"
                  placeholder="Years"
                />
                <div
                  onClick={() => {
                    if (
                      inputData.company.trim() &&
                      inputData.position.trim() &&
                      inputData.years.trim()
                    ) {
                      const updatedProfile = {
                        ...userProfile,
                        pastWork: [...userProfile.pastWork, inputData],
                      };
                      setUserprofile(updatedProfile);
                      setIsProfileModified(true);
                    }
                    setInputData({ company: "", position: "", years: "" });
                    setIsWorkModaalOpen(false);
                  }}
                  className={styles.updateProfile_btn}
                >
                  Add Work
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Education Modal */}
        {isEduModaalOpen && (
          <div
            onClick={() => setIsEduModaalOpen(false)}
            className={styles.commentsContainer}
          >
            <div
              className={styles.commentBoxWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.allCommentsContainer}>
                <input
                  onChange={handleInputChangeEducation}
                  name="school"
                  className={styles.inputFeild}
                  type="text"
                  placeholder="Enter School"
                />
                <input
                  onChange={handleInputChangeEducation}
                  name="degree"
                  className={styles.inputFeild}
                  type="text"
                  placeholder="Enter Degree"
                />
                <input
                  onChange={handleInputChangeEducation}
                  name="typeOfStudy"
                  className={styles.inputFeild}
                  type="text"
                  placeholder="Type of Study"
                />
                <div
                  onClick={() => {
                    if (
                      inputData1.school.trim() &&
                      inputData1.degree.trim() &&
                      inputData1.typeOfStudy.trim()
                    ) {
                      const updatedProfile = {
                        ...userProfile,
                        education: [...userProfile.education, inputData1],
                      };
                      setUserprofile(updatedProfile);
                      setIsProfileModified(true);
                    }
                    setInputData1({ school: "", degree: "", typeOfStudy: "" });
                    setIsEduModaalOpen(false);
                  }}
                  className={styles.updateProfile_btn}
                >
                  Add Education
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}