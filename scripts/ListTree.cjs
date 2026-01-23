const fs = require('fs');
const path = require('path');

let result = '';

/**
 * 递归列出目录树结构
 * @param {string} dirPath - 要列出的目录路径
 * @param {string[]} excludeFolders - 要排除的文件夹列表
 * @param {string} indent - 缩进字符串，用于格式化输出
 * @returns {void}
 */
function listTree(dirPath, excludeFolders = [], indent = '') {
  try {
    // 检查路径是否存在
    if (!fs.existsSync(dirPath)) {
      console.error(`Error: Directory ${dirPath} does not exist.`);
      return;
    }

    // 读取目录内容
    const items = fs.readdirSync(dirPath);

    items.forEach((item, index) => {
      const itemPath = path.join(dirPath, item);
      const isLast = index === items.length - 1;
      const itemStat = fs.statSync(itemPath);
      const isDirectory = itemStat.isDirectory();

      // 检查是否需要排除此文件夹
      if (isDirectory && excludeFolders.includes(item)) {
        return;
      }

      // 输出当前项
      const prefix = isLast ? '└── ' : '├── ';
      result += `${indent}${prefix}${item}\n`;

      // 如果是目录且未被排除，递归列出
      if (isDirectory) {
        const newIndent = indent + (isLast ? '    ' : '│   ');
        listTree(itemPath, excludeFolders, newIndent);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
}

/**
 * 主函数
 */
function main() {
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node ListTree.js <directory_path> [exclude_folders]');
    console.log('Example: node ListTree.js ./src node_modules|.git|build');
    return;
  }

  const dirPath = args[0];
  const excludeFoldersStr = args[1] || '';
  const excludeFolders = excludeFoldersStr.split(',').filter(folder => folder.trim() !== '');

  console.log(`Directory tree for: ${dirPath}`);
  if (excludeFolders.length > 0) {
    console.log(`Excluding folders: ${excludeFolders.join(', ')}`);
  }
  console.log('');

  listTree(dirPath, excludeFolders);

  fs.writeFileSync(path.join(dirPath, 'tree.txt'), result);
}

// 执行主函数
main();
