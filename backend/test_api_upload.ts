import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { prisma } from './src/config/db';

async function testUpload() {
  try {
    // 1. Get the first org to generate a token
    const org = await prisma.organization.findFirst();
    if (!org) {
      console.log("No organization found");
      return;
    }

    // 2. Generate a token
    const token = jwt.sign({ orgId: org.id }, process.env.JWT_SECRET!);

    // 3. Create form data
    const formData = new FormData();
    const filePath = path.join(__dirname, '../sample_return_policy.pdf');
    formData.append('file', fs.createReadStream(filePath));

    // 4. Make request
    console.log("Making request to http://localhost:5001/api/documents...");
    const res = await axios.post('http://localhost:5001/api/documents', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Response:", res.data);
  } catch (error: any) {
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
    } else {
      console.error("Axios Error:", error.message);
    }
  }
}

testUpload();
