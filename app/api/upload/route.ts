import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'certificates';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and retain extension
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetDir = path.join(process.cwd(), 'public', folder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, originalName);
    fs.writeFileSync(filePath, buffer);

    // If uploading a resume PDF, also sync to public/resume.pdf so standard links refresh
    if (folder === 'resumes' || folder === 'resume' || originalName.toLowerCase() === 'resume.pdf') {
      const defaultResumePath = path.join(process.cwd(), 'public', 'resume.pdf');
      fs.writeFileSync(defaultResumePath, buffer);
    }

    const publicUrl = `/${folder}/${originalName}`;
    return NextResponse.json({ url: publicUrl, name: originalName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
