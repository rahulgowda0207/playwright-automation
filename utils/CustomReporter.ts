import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

// --- Day 6: Data structure to track each test's result ---
interface TestEntry {
  title: string;
  suite: string;
  status: string;
  duration: number;
  startTime: string;
  error?: string;
}

// --- Day 6: Custom Reporter class ---
// Implements Playwright's Reporter interface with 3 lifecycle hooks:
//   onBegin  - called once before all tests start
//   onTestEnd - called after each individual test completes
//   onEnd    - called once after all tests finish (generates report here)
class CustomHtmlReporter implements Reporter {
  private results: TestEntry[] = [];
  private suiteStartTime: Date = new Date();

  // Day 6: Called once before all tests begin
  onBegin(config: FullConfig, suite: Suite): void {
    this.suiteStartTime = new Date();
    console.log(`\n[CustomReporter] Test run started at ${this.suiteStartTime.toISOString()}`);
    console.log(`[CustomReporter] Total tests to run: ${suite.allTests().length}\n`);
  }

  // Day 6: Called after each individual test completes
  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      title: test.title,
      suite: test.parent?.title || 'Default Suite',
      status: result.status,
      duration: result.duration,
      startTime: result.startTime.toISOString(),
      error: result.errors?.[0]?.message?.substring(0, 200) || undefined,
    });
  }

  // Day 6: Called once after all tests finish - generates the HTML report
  onEnd(result: FullResult): void {
    const endTime = new Date();
    const totalDuration = endTime.getTime() - this.suiteStartTime.getTime();

    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => r.status === 'failed').length;
    const skipped = this.results.filter((r) => r.status === 'skipped').length;

    // Day 6: Generate HTML and write to reports/custom-report.html
    const html = this.buildHtml(passed, failed, skipped, totalDuration);

    const reportsDir = path.resolve('reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(reportsDir, 'custom-report.html'), html, 'utf-8');

    console.log(`\n[CustomReporter] Report generated at reports/custom-report.html`);
    console.log(`[CustomReporter] Results: ${passed} passed, ${failed} failed, ${skipped} skipped\n`);
  }

  // --- Day 6: HTML generation helper ---
  // Builds a self-contained HTML page with inline CSS (no external dependencies)
  private buildHtml(
    passed: number,
    failed: number,
    skipped: number,
    totalDuration: number
  ): string {
    const rows = this.results
      .map(
        (r) => `
      <tr class="${r.status}">
        <td>${r.suite}</td>
        <td>${r.title}</td>
        <td class="status">${r.status.toUpperCase()}</td>
        <td>${(r.duration / 1000).toFixed(2)}s</td>
        <td>${r.startTime}</td>
        <td>${r.error || '-'}</td>
      </tr>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Day 6 - Custom Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
    .summary-card { padding: 15px 25px; border-radius: 8px; color: white; font-size: 18px; min-width: 120px; text-align: center; }
    .summary-card.passed { background: #4caf50; }
    .summary-card.failed { background: #f44336; }
    .summary-card.skipped { background: #ff9800; }
    .summary-card.total { background: #2196f3; }
    .summary-card.duration { background: #9c27b0; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th { background: #333; color: white; padding: 12px; text-align: left; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; }
    tr:hover { background: #f9f9f9; }
    tr.passed .status { color: #4caf50; font-weight: bold; }
    tr.failed .status { color: #f44336; font-weight: bold; }
    tr.skipped .status { color: #ff9800; font-weight: bold; }
    .timestamp { color: #666; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Day 6 - Custom Test Execution Report</h1>
  <p class="timestamp">Generated: ${new Date().toISOString()} | Total Duration: ${(totalDuration / 1000).toFixed(2)}s</p>
  <div class="summary">
    <div class="summary-card passed">Passed: ${passed}</div>
    <div class="summary-card failed">Failed: ${failed}</div>
    <div class="summary-card skipped">Skipped: ${skipped}</div>
    <div class="summary-card total">Total: ${this.results.length}</div>
    <div class="summary-card duration">Duration: ${(totalDuration / 1000).toFixed(2)}s</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Suite</th>
        <th>Test</th>
        <th>Status</th>
        <th>Duration</th>
        <th>Start Time</th>
        <th>Error</th>
      </tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>
</body>
</html>`;
  }
}

export default CustomHtmlReporter;
