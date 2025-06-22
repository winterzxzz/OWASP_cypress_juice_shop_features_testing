const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function exportTestResultsToExcel() {
    const reportsDir = path.join(process.cwd(), 'cypress', 'reports');

    if (!fs.existsSync(reportsDir)) {
        console.log('❌ No reports directory found. Run tests first.');
        return;
    }

    // Find all JSON report files
    const reportFiles = fs.readdirSync(reportsDir)
        .filter(file => file.endsWith('.json'))
        .map(file => path.join(reportsDir, file));

    if (reportFiles.length === 0) {
        console.log('❌ No JSON report files found.');
        return;
    }

    // Get the latest JSON report by modified time
    const latestReport = reportFiles
        .map(file => ({ file, mtime: fs.statSync(file).mtime }))
        .sort((a, b) => b.mtime - a.mtime)[0].file;

    console.log(`📄 Processing report: ${latestReport}`);

    // Read JSON content
    const reportData = JSON.parse(fs.readFileSync(latestReport, 'utf8'));

    // Get suite structure (mochawesome sometimes nests it differently)
    const suites = reportData.suites || reportData.results?.[0]?.suites || [];

    const testResults = [];

    suites.forEach(suite => {
        suite.tests.forEach(test => {
            testResults.push({
                testCase: test.title,
                testSuite: suite.title,
                status: test.state,
                duration: test.duration || 0,
                error: test.err?.message || '',
                fullTitle: test.fullTitle,
                timestamp: new Date(reportData.stats.start).toISOString(),
                date: new Date(reportData.stats.start).toLocaleDateString('vi-VN')
            });
        });
    });

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();

    // Prepare worksheet data
    const worksheetData = [
        ['Test Case', 'Test Suite', 'Status', 'Duration (ms)', 'Error Message', 'Full Title', 'Timestamp', 'Date']
    ];

    testResults.forEach(result => {
        worksheetData.push([
            result.testCase,
            result.testSuite,
            result.status,
            result.duration,
            result.error,
            result.fullTitle,
            result.timestamp,
            result.date
        ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet['!cols'] = [
        { width: 50 },
        { width: 40 },
        { width: 15 },
        { width: 15 },
        { width: 60 },
        { width: 70 },
        { width: 25 },
        { width: 15 }
    ];

    // Apply basic header style (only works in compatible tools)
    const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } }
    };

    ['A1','B1','C1','D1','E1','F1','G1','H1'].forEach(cell => {
        if (worksheet[cell]) {
            worksheet[cell].s = headerStyle;
        }
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Results');

    // Summary sheet
    const passed = testResults.filter(t => t.status === 'passed').length;
    const failed = testResults.filter(t => t.status === 'failed').length;
    const total = testResults.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

    const summaryData = [
        ['Test Summary', ''],
        ['Total Tests', total],
        ['Passed', passed],
        ['Failed', failed],
        ['Pass Rate', `${passRate}%`],
        ['Test Date', new Date().toLocaleDateString('vi-VN')],
        ['Export Time', new Date().toLocaleString('vi-VN')]
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [{ width: 20 }, { width: 30 }];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `juice-shop-test-results-${timestamp}.xlsx`;
    const filepath = path.join(reportsDir, filename);

    // Write Excel file
    XLSX.writeFile(workbook, filepath);

    // Done!
    console.log(`\n✅ Excel report generated: ${filepath}`);
    console.log(`📊 Total tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Pass rate: ${passRate}%`);
}

// Run it!
exportTestResultsToExcel();
