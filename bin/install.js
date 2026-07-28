#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const HOME = process.env.CHENGFENG_LANDINGPAGE_HOME || os.homedir();
const PKG_ROOT = path.resolve(__dirname, '..');
const SKILL_NAME = 'metaphor-led-landing';
const SOURCE = path.join(PKG_ROOT, 'skills', SKILL_NAME);
const CLAUDE_SKILLS = path.join(HOME, '.claude', 'skills');
const CODEX_SKILLS = path.join(HOME, '.codex', 'skills');
const DESTINATION = path.join(CLAUDE_SKILLS, SKILL_NAME);
const LINK = path.join(CODEX_SKILLS, SKILL_NAME);

const log = (message = '') => process.stdout.write(`${message}\n`);
const timestamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function backupAndRemove(target, label) {
  if (!fs.existsSync(target) && !fs.lstatSync(target, { throwIfNoEntry: false })) return null;
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(target);
    return null;
  }
  const backupRoot = path.join(CLAUDE_SKILLS, '.backups');
  const backup = path.join(backupRoot, `${label}-${timestamp()}`);
  fs.mkdirSync(backupRoot, { recursive: true });
  if (stat.isDirectory()) copyDir(target, backup);
  else fs.copyFileSync(target, backup);
  fs.rmSync(target, { recursive: true, force: true });
  return backup;
}

function install() {
  if (!fs.existsSync(SOURCE)) throw new Error(`Missing packaged skill: ${SOURCE}`);
  fs.mkdirSync(CLAUDE_SKILLS, { recursive: true });
  const skillBackup = backupAndRemove(DESTINATION, SKILL_NAME);
  copyDir(SOURCE, DESTINATION);
  for (const file of ['LICENSE', 'NOTICE.md', 'CITATION.cff']) {
    fs.copyFileSync(path.join(PKG_ROOT, file), path.join(DESTINATION, file));
  }
  fs.mkdirSync(CODEX_SKILLS, { recursive: true });
  const codexBackup = backupAndRemove(LINK, `${SKILL_NAME}-codex`);
  fs.symlinkSync(DESTINATION, LINK);
  log(`✓ ${SKILL_NAME} -> ${DESTINATION}`);
  log(`✓ Codex link -> ${LINK}`);
  if (skillBackup) log(`  Claude backup: ${skillBackup}`);
  if (codexBackup) log(`  Codex backup: ${codexBackup}`);
  log('Restart Claude Code or Codex so the skill list reloads.');
}

function doctor() {
  const skill = path.join(DESTINATION, 'SKILL.md');
  const notice = path.join(DESTINATION, 'NOTICE.md');
  const linkOk = fs.existsSync(LINK) && fs.lstatSync(LINK).isSymbolicLink();
  const ok = fs.existsSync(skill) && fs.existsSync(notice) && linkOk;
  log(`${fs.existsSync(skill) ? '✓' : '✗'} Claude skill: ${skill}`);
  log(`${fs.existsSync(notice) ? '✓' : '✗'} Attribution notice: ${notice}`);
  log(`${linkOk ? '✓' : '✗'} Codex symlink: ${LINK}`);
  process.exitCode = ok ? 0 : 1;
}

function uninstall() {
  const linkBackup = backupAndRemove(LINK, `${SKILL_NAME}-codex-removed`);
  const skillBackup = backupAndRemove(DESTINATION, `${SKILL_NAME}-removed`);
  log(`✓ Removed ${SKILL_NAME}; backups are preserved.`);
  if (skillBackup) log(`  Claude backup: ${skillBackup}`);
  if (linkBackup) log(`  Codex backup: ${linkBackup}`);
}

function help() {
  log('chengfeng-landingpage');
  log('');
  log('Usage:');
  log('  npx -y github:Agentchengfeng/chengfeng-landingpage install');
  log('  npx -y github:Agentchengfeng/chengfeng-landingpage cpm install');
  log('  chengfeng-landingpage doctor');
  log('');
  log('Commands: install, doctor, uninstall, help');
  log('For test-only installs: CHENGFENG_LANDINGPAGE_HOME=/tmp/test-home');
}

function main() {
  let [command = 'install', subcommand] = process.argv.slice(2);
  if (command === 'cpm') command = subcommand || 'install';
  if (['help', '--help', '-h'].includes(command)) return help();
  if (command === 'install') return install();
  if (command === 'doctor') return doctor();
  if (command === 'uninstall') return uninstall();
  log(`Unknown command: ${command}`);
  help();
  process.exitCode = 1;
}

main();
