import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/instructify-logo.png';
import Auth from '../../utils/auth';
// importing Search bar to use but it wont be IN the navbar, but under it
import SearchBar from '../search/SearchBar';

import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupIcon from '@mui/icons-material/Group';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LoginIcon from '@mui/icons-material/Login';

export {
  React,
  useState, 
  useEffect, 
  useRef,
  useNavigate, 
  useLocation,
  Link, 
  SearchBar,
  logo,
  Auth,
  LogoutIcon,
  DashboardIcon,
  CreateTwoToneIcon,
  AccountBoxIcon,
  VolunteerActivismIcon,
  GroupIcon,
  YouTubeIcon,
  LoginIcon
}