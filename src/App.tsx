import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "antd/dist/antd.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ScholarTranslation from "./pages/ScholarTranslation/ScholarTranslation";
import Notes from "./pages/Notes/Notes";
import WordSearch from "./pages/WordSearch/WordSearch";
import WordbyWord from "./pages/WordbyWord/WordbyWord";
import AddTranslation from "./pages/AddTranslation/AddTranslation";
import MyTranslation from "./pages/MyTranslation/MyTranslation";
import UserSettings from "./pages/UserSettings/UserSettings";
import Login from "./pages/Login/Login";
import Users from "./pages/Users/Users";
import Layout from "./components/Layout/Layout";
import RootWordTranslation from "./pages/RootWordTranslation/RootWordTranslation";
import RefrenceWordTranslation from "./pages/RefrenceWordTranslation/RefrenceWordTranslation";
import Topics from "./pages/Topics/Topics";
import Home from "./pages/Home";
import AyatNotes from "./pages/AyatNotes/AyatNotes";
import WordNotes from "./pages/WordNotes/WordNotes";
import Verse from "./pages/Verse";
import UserPermission from "./pages/UserPermissions/UserPermissions";
import AdminPermissions from "./pages/AdminPermissions/AdminPermissions";
import GrammerNotes from "./pages/GrammerNotes/GrammerNotes";
import Stories from "./pages/Stories/Stories";
import StoryForm from "./pages/Stories/StoryForm/StoryForm";
import PublishedTopics from "./pages/Topics/PublishedTopics";
import NonPublishedTopics from "./pages/Topics/NonPublishedTopics";
import Help from "./pages/Help/Help";

const App = () => {
  const ADMIN_ROLE = 1;
  const PROGRAMMER_ROLE = 2;
  const SCHOLAR_ROLE = 3;
  const USER_ROLE = 4;
  const ALL_ROLES = [ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE, USER_ROLE];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/wordbyword"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<WordbyWord />} />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<Users />} />
          }
        />
        <Route
          path="/notes"
          element={
            <Layout>
              <Notes isOpen={false} />
            </Layout>
          }
        />
        <Route
          path="/wordsearch"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<WordSearch />} />
          }
        />
        <Route
          path="/usersettings"
          element={
            <ProtectedRoute
              allowedRoles={ALL_ROLES}
              element={<UserSettings />}
            />
          }
        />
        <Route
          path="/schollartranslation"
          element={
            <ProtectedRoute
              allowedRoles={ALL_ROLES}
              element={<ScholarTranslation />}
            />
          }
        />
        <Route
          path="/addtranslation"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<AddTranslation />}
            />
          }
        />
        <Route
          path="/mytranslation"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<MyTranslation />}
            />
          }
        />

        <Route
          path="/rootwords"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE]}
              element={<RootWordTranslation />}
            />
          }
        />
        <Route
          path="/refrencewords"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<RefrenceWordTranslation />}
            />
          }
        />
        <Route
          path="/adminpermissions"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE]}
              element={<AdminPermissions />}
            />
          }
        />
        <Route
          path="/userpermissions"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE]}
              element={<UserPermission />}
            />
          }
        />

        <Route
          path="/topics"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<Topics />} />
          }
        />
        <Route
          path="/ayatnotes"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<AyatNotes />}
            />
          }
        />
        <Route
          path="/wordnotes"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<WordNotes />}
            />
          }
        />
        <Route
          path="/grammernotes"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<GrammerNotes />}
            />
          }
        />
        <Route
          path="/stories"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<Stories />} />
          }
        />
        <Route
          path="/stories/add"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<StoryForm />} />
          }
        />
        <Route
          path="/publishedtopics"
          element={
            <ProtectedRoute
              allowedRoles={ALL_ROLES}
              element={<PublishedTopics />}
            />
          }
        />
        <Route
          path="/nonpublishedtopics"
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, PROGRAMMER_ROLE, SCHOLAR_ROLE]}
              element={<NonPublishedTopics />}
            />
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute
              allowedRoles={ALL_ROLES}
              element={<Help />}
            />
          }
        />
        <Route
          path="/stories/edit/:id"
          element={
            <ProtectedRoute allowedRoles={ALL_ROLES} element={<StoryForm />} />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/:id"
          element={
            <Layout>
              <Verse />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
