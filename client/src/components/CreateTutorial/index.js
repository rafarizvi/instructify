// use of react and apollo clients
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// use of mutations and queries
import { ADD_TUTORIAL } from '../../utils/mutations';
import { QUERY_USER_TUTORIALS } from '../../utils/queries';

//use of additional services / components to application
import AuthService from '../../utils/auth';
import ReactQuill from 'react-quill';
import WordCount from '../wordCount/WordCount';
import hljs from 'highlight.js';

// exporting use of react and apollo clients
export { useState, useEffect, useMutation, useNavigate };

// exporting use of mutations and queries
export { ADD_TUTORIAL, QUERY_USER_TUTORIALS };

// exporting use of additional services / components to application
export { AuthService, ReactQuill, WordCount, hljs };
