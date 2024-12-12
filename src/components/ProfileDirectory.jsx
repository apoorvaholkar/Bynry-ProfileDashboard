import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProfileCard from "./ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Search, Filter } from "lucide-react";

function ProfileDirectory() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("name");
  const [filterInterest, setFilterInterest] = useState("");
  const [uniqueInterests, setUniqueInterests] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const profilesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const interests = [...new Set(profilesData.map((p) => p.interest).filter(Boolean))];
        setUniqueInterests(interests);

        setProfiles(profilesData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    let result = [...profiles];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      result = result.filter((profile) => {
        return (
          profile.name.toLowerCase().includes(searchTermLower) ||
          (profile.description && profile.description.toLowerCase().includes(searchTermLower)) ||
          (profile.interest && profile.interest.toLowerCase().includes(searchTermLower))
        );
      });
    }

    if (filterInterest) {
      result = result.filter((profile) => profile.interest === filterInterest);
    }

    result.sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [profiles, searchTerm, sortOrder, sortField, filterInterest]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleCardClick = (profile) => {
    setSelectedProfile(profile);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProfile(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <p className="ml-4 text-lg font-medium">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-10 py-10 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-6">Employee Directory</h1>

      <NavigationMenu className="w-full mb-6">
        <NavigationMenuList className="flex justify-between items-center">
          <NavigationMenuItem className="flex items-center space-x-2 w-full">
            <div className="relative w-full max-w-md">
              <Input
                className="w-full pl-10"
                placeholder="Search by name, description, or interest..."
                value={searchTerm}
                size={95}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
          </NavigationMenuItem>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gray-300">Sort ({sortOrder === "asc" ? "A-Z" : "Z-A"})</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={toggleSortOrder}>Toggle Sort Order</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gray-300">
                  <Filter className="mr-2" size={16} /> Filter Interests
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setFilterInterest("")}
                  className={filterInterest === "" ? "font-bold" : ""}
                >
                  All Interests
                </DropdownMenuItem>
                {uniqueInterests.map((interest) => (
                  <DropdownMenuItem
                    key={interest}
                    onClick={() => setFilterInterest(interest)}
                    className={filterInterest === interest ? "font-bold" : ""}
                  >
                    {interest}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onClick={() => handleCardClick(profile)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No profiles found matching your search criteria.</div>
      )}

      {showPopup && selectedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedProfile.name}</h3>
            {selectedProfile.photographUrl && (
              <div className="flex justify-center mb-4"> {/* Center the image */}
              <img 
                src={selectedProfile.photographUrl} 
                alt={selectedProfile.name} 
                className="w-48 h-48 object-cover rounded-lg" 
              />
            </div>  
      )}
            <p><strong>Description:</strong> {selectedProfile.description}</p>
            <p><strong>Contact :</strong> {selectedProfile.contactInfo}</p>  
            <p><strong>Interests:</strong> {selectedProfile.interest}</p>
            
            <div className="flex justify-between items-center mt-4">
              <button type="button" className="text-red-500" onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfileDirectory;
