// 批量替换所有页面的 header logo 为 Logo 组件
const fs = require('fs');
const path = require('path');

const files = [
  'src/app/page.tsx',
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/register/page.tsx',
  'src/app/(main)/dashboard/page.tsx',
  'src/app/(main)/grammar/page.tsx',
  'src/app/(main)/kana/page.tsx',
  'src/app/(main)/pet/page.tsx',
  'src/app/(main)/practice/page.tsx',
  'src/app/(main)/quiz/page.tsx',
  'src/app/(main)/vocabulary/page.tsx',
];

const ROOT = path.join(__dirname, '..');

const oldPattern = /          <Link href="\/(?:dashboard)?" className="flex items-baseline gap-2">\s*\n            <span className="font-display text-2xl font-medium tracking-tight">kana<\/span>\s*\n            <span className="font-display text-2xl font-medium tracking-tight" style=\{\{ color: 'var\(--vermillion\)' \}\}>(?:AI|日本語)<\/span>\s*\n          <\/Link>/g;

let updated = 0;
for (const file of files) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠ ${file} 不存在`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const before = content;

  // 替换 logo 块
  content = content.replace(oldPattern, '          <Logo />');

  if (content !== before) {
    // 检查是否已导入 Logo
    if (!content.includes("from '@/components/ui'") || !content.match(/import\s*\{[^}]*\bLogo\b[^}]*\}\s*from/)) {
      // 添加 Logo 导入
      const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*'@\/components\/ui';/);
      if (importMatch) {
        const imports = importMatch[1];
        if (!imports.includes('Logo')) {
          content = content.replace(
            /import\s*\{([^}]+)\}\s*from\s*'@\/components\/ui';/,
            `import { ${imports.trim().replace(/,\s*$/, '').replace(/^\s*/, '')}, Logo } from '@/components/ui';`
          );
        }
      } else {
        // 在文件顶部添加导入
        const firstImport = content.match(/^import[^;]+;/m);
        if (firstImport) {
          content = content.replace(
            firstImport[0],
            `${firstImport[0]}\nimport { Logo } from '@/components/ui';`
          );
        } else {
          content = `import { Logo } from '@/components/ui';\n${content}`;
        }
      }
    }

    fs.writeFileSync(fullPath, content);
    console.log(`✓ ${file}`);
    updated++;
  } else {
    console.log(`⊘ ${file} (无需修改)`);
  }
}

console.log(`\n完成! 更新了 ${updated} 个文件。`);
