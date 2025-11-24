import { stripMarkdown, formatDisplayText } from './markdownStripper';

// Test cases
const testCases = [
  {
    input: "**This is bold** and *this is italic*",
    expected: "This is bold and this is italic"
  },
  {
    input: "# Heading 1\n## Heading 2\n### Heading 3",
    expected: "Heading 1\nHeading 2\nHeading 3"
  },
  {
    input: "* Item 1\n* Item 2\n- Item 3",
    expected: "• Item 1\n• Item 2\n• Item 3"
  },
  {
    input: "Here is `inline code` and a [link](https://example.com)",
    expected: "Here is inline code and a link"
  },
  {
    input: "1. First item\n2. Second item\n3. Third item",
    expected: "First item\nSecond item\nThird item"
  },
  {
    input: "```javascript\nconst x = 5;\nconsole.log(x);\n```",
    expected: "const x = 5;\nconsole.log(x);"
  }
];

export function runTests() {
  console.log('Testing markdown stripper...\n');
  
  testCases.forEach((test, index) => {
    const result = stripMarkdown(test.input);
    const passed = result === test.expected;
    
    console.log(`Test ${index + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (!passed) {
      console.log(`  Input: ${test.input}`);
      console.log(`  Expected: ${test.expected}`);
      console.log(`  Got: ${result}`);
    }
  });
}