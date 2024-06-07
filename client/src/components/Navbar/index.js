import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/instructify-logo.png';
import Auth from '../../utils/auth';
// importing Search bar to use but it wont be IN the navbar, but under it
import SearchBar from '../Search/SearchBar';

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
  Auth
}