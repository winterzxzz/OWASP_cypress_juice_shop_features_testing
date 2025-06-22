const { defineConfig } = require("cypress");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,

    setupNodeEvents(on, config) {
      on('task', {
        async exportResultsToExcel({ results, title }) {
          try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Results");

            // === 1. Add merged title row (Row 1) ===
            worksheet.mergeCells('A1:D1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = title;
            titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF000000' } };
            titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
            titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9900' } };
            worksheet.getRow(1).height = 30;

            // === 2. Add header row (Row 2) ===
            worksheet.addRow(["STT", "TEST CASE", "STATE", "START TIME"]);
            const headerRow = worksheet.getRow(2);
            headerRow.height = 30;
            headerRow.alignment = { vertical: "middle", horizontal: "center" };
            headerRow.eachCell(cell => {
              cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
            });

            // === 4. Column widths ===
            worksheet.getColumn(1).width = 10;  // STT
            worksheet.getColumn(2).width = 50;  // Title
            worksheet.getColumn(3).width = 15;  // State
            worksheet.getColumn(4).width = 60;  // Start Time

            // === 5. Data rows (Row 4+) ===
            results.forEach((result, index) => {
              const rowIndex = index + 4;
              const row = worksheet.getRow(rowIndex);

              row.values = [
                index + 1,
                result.title,
                result.state,
                result.time 
              ];
              row.height = 30;

              row.eachCell((cell, colNumber) => {
                cell.alignment = {
                  wrapText: true,
                  vertical: 'middle',
                  horizontal: colNumber === 3 ? 'center' : 'left'
                };
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" }
                };
              });

              // Conditional formatting for "State" cell (Column C)
              const stateCell = row.getCell(3);
              const isPassed = result.state === "Passed";
              stateCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: isPassed ? "FF00AA00" : "FFAA0000" }
              };
              stateCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            });

            // === 6. Save file ===
            const downloadsDir = path.join(__dirname, "downloads");
            if (!fs.existsSync(downloadsDir)) {
              fs.mkdirSync(downloadsDir, { recursive: true });
            }

            const now = new Date().toISOString().replace(/[:.]/g, '-');

            // conver title to lowercase and replace space with _
            const formattedTitle = title.toLowerCase().replace(/ /g, '_');

            const outputPath = path.join(downloadsDir, `${formattedTitle}_${now}.xlsx`);

            const buffer = await workbook.xlsx.writeBuffer();
            fs.writeFileSync(outputPath, buffer);

            console.log(`✅ Excel file written to: ${outputPath}`);
            return null;
          } catch (error) {
            console.error("❌ Error writing Excel file:", error);
            return null;
          }
        }
      });

      return config;
    }
  }
});
