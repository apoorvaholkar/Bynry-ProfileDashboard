import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";

const AdminPanel = () => {
  const [profiles, setProfiles] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [newProfile, setNewProfile] = useState({
    name: "",
    photographUrl: "",
    description: "",
    longitude: "",
    latitude: "",
    contactInfo: "",
    interest: "",
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const profilesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProfiles = [...filteredProfiles].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleFormSubmit = async () => {
    for (const [key, value] of Object.entries(newProfile)) {
      if (!value.trim()) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
      if (isEdit) {
        const docRef = doc(db, "profiles", currentEditId);
        await updateDoc(docRef, newProfile);
        alert("Profile updated successfully!");
        setProfiles((prev) =>
          prev.map((profile) =>
            profile.id === currentEditId ? { ...profile, ...newProfile } : profile
          )
        );
        setIsFormOpen(false);
        setIsEdit(false);
      } else {
        const docRef = await addDoc(collection(db, "profiles"), newProfile);
        alert("Profile added successfully!");
        setProfiles((prev) => [...prev, { id: docRef.id, ...newProfile }]);
        setIsFormOpen(false);
      }
      setNewProfile({
        name: "",
        photographUrl: "",
        description: "",
        longitude: "",
        latitude: "",
        contactInfo: "",
        interest: "",
      });
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  const handleEdit = (id) => {
    const profile = profiles.find((profile) => profile.id === id);
    setNewProfile(profile);
    setCurrentEditId(id);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "profiles", id));
      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      alert("Profile deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className={`admin-panel ${isFormOpen ? "overflow-hidden h-screen" : ""}`}>
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Manage Profiles</h1>
      {!isFormOpen && (
      <NavigationMenu>
        <NavigationMenuList className="flex justify-between items-center p-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Button
                className="bg-[#f1b04c] text-white hover:bg-[#e27602]"
                onClick={() => setIsFormOpen(true)}
              >
                Add New
              </Button>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <div className="flex items-center space-x-2">
            <Input
              className="w-96"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="text-gray-500" size={20} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gray-300">Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={toggleSortOrder}>
                Sort by Name ({sortOrder === "asc" ? "Ascending" : "Descending"})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuList>

        <NavigationMenuIndicator>
          <div className="absolute w-full h-1 bg-blue-500"></div>
        </NavigationMenuIndicator>

        <NavigationMenuViewport />
      </NavigationMenu>
        )}


      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Profile" : "Add New Profile"}</h2>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
              />
              <Input
                placeholder="Photograph URL"
                value={newProfile.photographUrl}
                onChange={(e) => setNewProfile({ ...newProfile, photographUrl: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={newProfile.description}
                onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
              />
              <Input
                placeholder="Longitude"
                value={newProfile.longitude}
                onChange={(e) => setNewProfile({ ...newProfile, longitude: e.target.value })}
              />
              <Input
                placeholder="Latitude"
                value={newProfile.latitude}
                onChange={(e) => setNewProfile({ ...newProfile, latitude: e.target.value })}
              />
              <Input
                placeholder="Contact Info"
                value={newProfile.contactInfo}
                onChange={(e) => setNewProfile({ ...newProfile, contactInfo: e.target.value })}
              />
              <Input
                placeholder="Interest"
                value={newProfile.interest}
                onChange={(e) => setNewProfile({ ...newProfile, interest: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button className="bg-gray-300" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-500 text-white" onClick={handleFormSubmit}>
                {isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isFormOpen && (
        <Table className="max-h-64 overflow-y-scroll">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.description}</TableCell>
                <TableCell>{profile.contactInfo}</TableCell>
                <TableCell>{profile.interest}</TableCell>
                <TableCell>
                  <Button
                    className="bg-[#f1b04c] text-white hover:bg-[#e27602]"
                    onClick={() => handleEdit(profile.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-500 text-white ml-2"
                    onClick={() => handleDelete(profile.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="text-right">
                Total Profiles: {sortedProfiles.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
};

export default AdminPanel;
