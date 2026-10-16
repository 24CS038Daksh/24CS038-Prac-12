const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ci/status', (req, res) => {
  res.json({
    status: 'ACTIVE',
    workflow: '.github/workflows/ci.yml',
    branch: 'main',
    pipeline: 'passing',
    studentId: '24CS038',
    studentName: 'Daksh Karangiya',
    course: 'ITUE301: Advance Web Development Framework',
    practical: 'Practical 12: CI/CD Pipeline with GitHub Actions'
  });
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`Practical 12: GitHub Actions CI/CD Pipeline Dashboard`);
  console.log(`Student: Daksh Karangiya | Roll: 24CS038`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log('====================================================');
});
