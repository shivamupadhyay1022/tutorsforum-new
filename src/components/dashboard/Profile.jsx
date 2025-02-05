import React, { useState } from "react";
import imageCompression from "browser-image-compression";

function Profile() {
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(",")[1];
      setImageSrc(base64Image); // Correctly set the base64 image source
    };
    reader.readAsDataURL(compressedFile);
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 hover:border-peach-300 transition-colors">
            <div>
              <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                Profile
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  className="object-cover rounded-full"
                  src={
                    imageSrc
                      ? `data:image/jpeg;base64,${imageSrc}`
                      : "https://i.pravatar.cc/150?img=1"
                  }
                  alt="Profile"
                />
                <button
                  size="icon"
                  variant="outline"
                  onClick={handleButtonClick}
                  className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-white to-[#ffded5]/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </div>
              <h2 className="text-xl font-semibold">Nitish Kuamr</h2>
              <p className="text-sm text-gray-500">nitish.kumar@example.com</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="hover:border-peach-300 transition-colors">
              <div>
                <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                  Personal Information
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="First Name"
                    defaultValue="Nitish"
                  />
                  <input
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Last Name"
                    defaultValue="Kumar"
                  />
                  <input
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Email"
                    defaultValue="nitish.kumar@example.com"
                  />
                  <input
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Phone"
                    defaultValue="+91 2340 567 890"
                  />
                </div>
                <button className="w-full rounded-full py-1 px-2 md:w-auto bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="hover:border-peach-300 transition-colors">
              <div>
                <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                  Recent Payments
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r from-white to-[#ffded5]/10"
                    >
                      <div className="flex items-center space-x-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                          />
                        </svg>

                        <div>
                          <p className="font-medium">Math Tutoring Session</p>
                          <p className="text-sm text-gray-500">
                            March {i}, 2024
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">₹{30 + i * 5}.00</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
