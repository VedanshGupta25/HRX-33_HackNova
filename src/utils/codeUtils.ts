
export interface CodeTemplate {
  language: string;
  code: string;
  description: string;
}

export class CodeUtils {
  // Detect if VS Code is installed on desktop
  static async detectVSCode(): Promise<boolean> {
    try {
      // Try to open VS Code protocol
      const testUrl = 'vscode://file/test';
      const link = document.createElement('a');
      link.href = testUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Create a promise that resolves based on whether the protocol is handled
      return new Promise((resolve) => {
        let resolved = false;
        
        // If VS Code is installed, the page should lose focus
        const handleVisibilityChange = () => {
          if (document.hidden && !resolved) {
            resolved = true;
            resolve(true);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.body.removeChild(link);
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Timeout after 3 seconds if no response
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(false);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
          }
        }, 3000);
        
        link.click();
      });
    } catch (error) {
      console.error('Error detecting VS Code:', error);
      return false;
    }
  }

  // Generate code templates based on task type and difficulty
  static generateCodeTemplate(taskTitle: string, taskType: string, difficulty: string): CodeTemplate[] {
    const templates: CodeTemplate[] = [];
    
    // Determine programming language based on task context
    const languages = ['javascript', 'python', 'java', 'cpp'];
    
    languages.forEach(lang => {
      let code = '';
      let description = '';
      
      switch (lang) {
        case 'javascript':
          code = CodeUtils.generateJavaScriptTemplate(taskTitle, taskType, difficulty);
          description = `JavaScript starter template for ${taskTitle}`;
          break;
        case 'python':
          code = CodeUtils.generatePythonTemplate(taskTitle, taskType, difficulty);
          description = `Python starter template for ${taskTitle}`;
          break;
        case 'java':
          code = CodeUtils.generateJavaTemplate(taskTitle, taskType, difficulty);
          description = `Java starter template for ${taskTitle}`;
          break;
        case 'cpp':
          code = CodeUtils.generateCppTemplate(taskTitle, taskType, difficulty);
          description = `C++ starter template for ${taskTitle}`;
          break;
      }
      
      templates.push({ language: lang, code, description });
    });
    
    return templates;
  }

  private static generateJavaScriptTemplate(taskTitle: string, taskType: string, difficulty: string): string {
    const isAdvanced = difficulty.toLowerCase() === 'advanced';
    const isProject = taskType.toLowerCase() === 'project';
    
    if (isProject) {
      return `// ${taskTitle} - JavaScript Project
// TODO: Implement your solution here

class ${taskTitle.replace(/\s+/g, '')} {
  constructor() {
    // Initialize your project
  }
  
  // Add your methods here
}

// Example usage
const project = new ${taskTitle.replace(/\s+/g, '')}();

// Tests
console.log('Project initialized successfully!');
`;
    }
    
    if (isAdvanced) {
      return `// ${taskTitle} - Advanced JavaScript Exercise
// TODO: Implement your solution here

/**
 * Advanced implementation for ${taskTitle}
 * @param {any} input - The input parameter
 * @returns {any} The result
 */
function solve(input) {
  // Your advanced solution here
  return null;
}

// Advanced test cases
const testCases = [
  // Add your test cases here
];

testCases.forEach((testCase, index) => {
  const result = solve(testCase.input);
  console.log(\`Test \${index + 1}: \${result === testCase.expected ? 'PASS' : 'FAIL'}\`);
});
`;
    }
    
    return `// ${taskTitle} - JavaScript Exercise
// TODO: Implement your solution here

function solve(input) {
  // Your solution here
  return null;
}

// Test your solution
const testInput = "example";
console.log(solve(testInput));
`;
  }

  private static generatePythonTemplate(taskTitle: string, taskType: string, difficulty: string): string {
    const isAdvanced = difficulty.toLowerCase() === 'advanced';
    const isProject = taskType.toLowerCase() === 'project';
    
    if (isProject) {
      return `# ${taskTitle} - Python Project
# TODO: Implement your solution here

class ${taskTitle.replace(/\s+/g, '')}:
    def __init__(self):
        """Initialize your project"""
        pass
    
    # Add your methods here

# Example usage
if __name__ == "__main__":
    project = ${taskTitle.replace(/\s+/g, '')}()
    print("Project initialized successfully!")
`;
    }
    
    if (isAdvanced) {
      return `# ${taskTitle} - Advanced Python Exercise
# TODO: Implement your solution here

def solve(input_data):
    """
    Advanced implementation for ${taskTitle}
    
    Args:
        input_data: The input parameter
        
    Returns:
        The result
    """
    # Your advanced solution here
    return None

# Advanced test cases
test_cases = [
    # Add your test cases here
]

for i, test_case in enumerate(test_cases):
    result = solve(test_case["input"])
    status = "PASS" if result == test_case["expected"] else "FAIL"
    print(f"Test {i + 1}: {status}")
`;
    }
    
    return `# ${taskTitle} - Python Exercise
# TODO: Implement your solution here

def solve(input_data):
    """Your solution here"""
    return None

# Test your solution
test_input = "example"
print(solve(test_input))
`;
  }

  private static generateJavaTemplate(taskTitle: string, taskType: string, difficulty: string): string {
    const className = taskTitle.replace(/\s+/g, '');
    const isAdvanced = difficulty.toLowerCase() === 'advanced';
    const isProject = taskType.toLowerCase() === 'project';
    
    if (isProject) {
      return `// ${taskTitle} - Java Project
// TODO: Implement your solution here

public class ${className} {
    
    public ${className}() {
        // Initialize your project
    }
    
    // Add your methods here
    
    public static void main(String[] args) {
        ${className} project = new ${className}();
        System.out.println("Project initialized successfully!");
    }
}
`;
    }
    
    if (isAdvanced) {
      return `// ${taskTitle} - Advanced Java Exercise
// TODO: Implement your solution here

public class ${className} {
    
    /**
     * Advanced implementation for ${taskTitle}
     * @param input The input parameter
     * @return The result
     */
    public static Object solve(Object input) {
        // Your advanced solution here
        return null;
    }
    
    public static void main(String[] args) {
        // Advanced test cases
        Object[] testInputs = {
            // Add your test cases here
        };
        
        for (int i = 0; i < testInputs.length; i++) {
            Object result = solve(testInputs[i]);
            System.out.println("Test " + (i + 1) + ": " + result);
        }
    }
}
`;
    }
    
    return `// ${taskTitle} - Java Exercise
// TODO: Implement your solution here

public class ${className} {
    
    public static Object solve(Object input) {
        // Your solution here
        return null;
    }
    
    public static void main(String[] args) {
        Object testInput = "example";
        System.out.println(solve(testInput));
    }
}
`;
  }

  private static generateCppTemplate(taskTitle: string, taskType: string, difficulty: string): string {
    const isAdvanced = difficulty.toLowerCase() === 'advanced';
    const isProject = taskType.toLowerCase() === 'project';
    
    if (isProject) {
      return `// ${taskTitle} - C++ Project
// TODO: Implement your solution here

#include <iostream>
#include <vector>
#include <string>

class ${taskTitle.replace(/\s+/g, '')} {
public:
    ${taskTitle.replace(/\s+/g, '')}() {
        // Initialize your project
    }
    
    // Add your methods here
};

int main() {
    ${taskTitle.replace(/\s+/g, '')} project;
    std::cout << "Project initialized successfully!" << std::endl;
    return 0;
}
`;
    }
    
    if (isAdvanced) {
      return `// ${taskTitle} - Advanced C++ Exercise
// TODO: Implement your solution here

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

/**
 * Advanced implementation for ${taskTitle}
 */
auto solve(auto input) {
    // Your advanced solution here
    return nullptr;
}

int main() {
    // Advanced test cases
    std::vector<std::string> testCases = {
        // Add your test cases here
    };
    
    for (size_t i = 0; i < testCases.size(); ++i) {
        auto result = solve(testCases[i]);
        std::cout << "Test " << (i + 1) << ": " << std::boolalpha << (result != nullptr) << std::endl;
    }
    
    return 0;
}
`;
    }
    
    return `// ${taskTitle} - C++ Exercise
// TODO: Implement your solution here

#include <iostream>
#include <string>

auto solve(const std::string& input) {
    // Your solution here
    return std::string{};
}

int main() {
    std::string testInput = "example";
    std::cout << solve(testInput) << std::endl;
    return 0;
}
`;
  }

  // Open VS Code with a specific file or workspace
  static openVSCode(filePath?: string, workspacePath?: string): void {
    let url = 'vscode://';
    
    if (workspacePath) {
      url += `file/${encodeURIComponent(workspacePath)}`;
    } else if (filePath) {
      url += `file/${encodeURIComponent(filePath)}`;
    } else {
      url = 'vscode://';
    }
    
    window.location.href = url;
  }

  // Open VS Code Web with optional file content
  static openVSCodeWeb(template?: CodeTemplate): void {
    let url = 'https://vscode.dev';
    
    if (template) {
      // VS Code Web supports opening with file content via URL parameters
      const params = new URLSearchParams({
        'file': `main.${CodeUtils.getFileExtension(template.language)}`,
        'content': template.code
      });
      url += `/?${params.toString()}`;
    }
    
    window.open(url, '_blank');
  }

  private static getFileExtension(language: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'js';
      case 'typescript':
        return 'ts';
      case 'python':
        return 'py';
      case 'java':
        return 'java';
      case 'cpp':
      case 'c++':
        return 'cpp';
      case 'c':
        return 'c';
      case 'csharp':
      case 'c#':
        return 'cs';
      case 'go':
        return 'go';
      case 'rust':
        return 'rs';
      case 'php':
        return 'php';
      case 'ruby':
        return 'rb';
      case 'swift':
        return 'swift';
      case 'kotlin':
        return 'kt';
      case 'scala':
        return 'scala';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'xml':
        return 'xml';
      case 'yaml':
      case 'yml':
        return 'yml';
      case 'markdown':
      case 'md':
        return 'md';
      default:
        return 'txt';
    }
  }
}
