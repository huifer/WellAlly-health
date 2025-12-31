#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
紧急医疗信息卡生成器
生成可打印的HTML格式紧急医疗信息卡，使用Tailwind CSS和Lucide图标
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional

# 设置标准输出为UTF-8编码（Windows兼容）
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')


class EmergencyCardGenerator:
    """紧急医疗信息卡生成器"""

    def __init__(self, base_dir: str = "data"):
        self.base_dir = Path(base_dir)
        self.card_data = {}

    def load_json(self, file_path: str) -> Optional[Dict]:
        """安全地加载JSON文件"""
        try:
            full_path = self.base_dir / file_path
            if full_path.exists():
                with open(full_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"警告: 无法加载文件 {file_path}: {e}")
        return None

    def collect_basic_info(self) -> Dict:
        """收集患者基本信息"""
        profile = self.load_json("profile.json")
        if not profile:
            return {
                "name": "未设置",
                "age": 0,
                "gender": "未设置",
                "blood_type": "未知",
                "height": None,
                "weight": None,
                "bmi": None,
                "emergency_contacts": []
            }

        basic_info = profile.get("basic_info", {})
        calculated = profile.get("calculated", {})

        return {
            "name": basic_info.get("name", "未设置"),
            "age": calculated.get("age", 0),
            "gender": basic_info.get("gender", "未设置"),
            "blood_type": basic_info.get("blood_type", "未知"),
            "height": f"{basic_info.get('height', '-')} {basic_info.get('height_unit', 'cm')}" if basic_info.get('height') else None,
            "weight": f"{basic_info.get('weight', '-')} {basic_info.get('weight_unit', 'kg')}" if basic_info.get('weight') else None,
            "bmi": calculated.get("bmi"),
            "emergency_contacts": profile.get("emergency_contacts", [])
        }

    def collect_critical_allergies(self) -> List[Dict]:
        """收集严重过敏信息（仅3-4级）"""
        allergy_data = self.load_json("allergies.json")
        if not allergy_data:
            return []

        allergies = allergy_data.get("allergies", [])
        critical_allergies = []

        for allergy in allergies:
            severity = allergy.get("severity", {})
            severity_level = severity.get("level_code", 0)
            current_status = allergy.get("current_status", {})

            # 仅收集3-4级且活跃的过敏
            if severity_level >= 3 and current_status.get("status") == "active":
                critical_allergies.append({
                    "allergen": allergy.get("allergen", {}).get("name", "未知"),
                    "severity_level": severity_level,
                    "severity_text": severity.get("level", "未知"),
                    "reaction": allergy.get("reaction_description", ""),
                    "diagnosed_date": allergy.get("diagnosis_date", ""),
                    "type": allergy.get("allergen", {}).get("type", "unknown")
                })

        return critical_allergies

    def collect_medications(self) -> List[Dict]:
        """收集当前用药"""
        medication_data = self.load_json("medications/medications.json")
        if not medication_data:
            return []

        medications = medication_data.get("medications", [])
        active_meds = []

        for med in medications:
            if med.get("active", True):
                dosage = med.get("dosage", {})
                active_meds.append({
                    "name": med.get("name", "未知"),
                    "dosage": f"{dosage.get('value', '')}{dosage.get('unit', '')}" if dosage.get("value") else "",
                    "frequency": med.get("frequency", ""),
                    "instructions": med.get("instructions", ""),
                    "purpose": med.get("purpose", ""),
                    "warnings": med.get("warnings", [])
                })

        return active_meds

    def collect_implants(self) -> List[Dict]:
        """从手术记录中收集植入物信息"""
        implants = []
        surgeries_dir = self.base_dir / "手术记录"

        if not surgeries_dir.exists():
            return []

        for month_dir in sorted(surgeries_dir.glob("*-*")):
            if not month_dir.is_dir():
                continue

            for surgery_file in month_dir.glob("*.json"):
                try:
                    surgery_data = self.load_json(f"手术记录/{month_dir.name}/{surgery_file.name}")
                    if surgery_data:
                        procedure = surgery_data.get("procedure", {})
                        procedure_implants = procedure.get("implants", [])
                        for implant in procedure_implants:
                            implants.append({
                                "type": implant.get("type", ""),
                                "date": implant.get("date", ""),
                                "hospital": implant.get("hospital", ""),
                                "notes": implant.get("notes", "")
                            })
                except Exception:
                    continue

        return implants

    def collect_medical_conditions(self) -> List[Dict]:
        """从出院小结中收集医疗状况"""
        conditions = []
        discharges_dir = self.base_dir / "出院小结"

        if not discharges_dir.exists():
            return []

        for month_dir in sorted(discharges_dir.glob("*-*")):
            if not month_dir.is_dir():
                continue

            for discharge_file in month_dir.glob("*.json"):
                try:
                    discharge_data = self.load_json(f"出院小结/{month_dir.name}/{discharge_file.name}")
                    if discharge_data:
                        diagnoses = discharge_data.get("diagnoses", [])
                        for diagnosis in diagnoses:
                            conditions.append({
                                "condition": diagnosis.get("condition", ""),
                                "diagnosis_date": diagnosis.get("date", ""),
                                "status": diagnosis.get("status", "随访中")
                            })
                except Exception:
                    continue

        return conditions

    def determine_variant(self, data: Dict) -> str:
        """根据数据自动确定卡片类型"""
        basic_info = data.get("basic_info", {})
        critical_allergies = data.get("critical_allergies", [])

        age = basic_info.get("age", 0)

        # 检查严重过敏
        has_grade_4 = any(a.get("severity_level") == 4 for a in critical_allergies)
        has_multiple_grade3 = len([a for a in critical_allergies if a.get("severity_level") == 3]) >= 2

        if has_grade_4 or has_multiple_grade3:
            return "severe"

        # 检查儿童
        if age and age < 18:
            return "child"

        # 检查老年人
        if age and age >= 65:
            return "elderly"

        # 默认标准卡
        return "standard"

    def generate_emergency_card(self, variant: str = None, print_size: str = "a4") -> str:
        """
        生成紧急医疗信息卡

        Args:
            variant: 卡片类型 (standard, child, elderly, severe)。如果为None，则自动检测
            print_size: 打印尺寸 (a4, wallet, large)

        Returns:
            生成的HTML文件路径
        """
        print("正在收集数据...")

        # 收集所有数据
        self.card_data = {
            "basic_info": self.collect_basic_info(),
            "critical_allergies": self.collect_critical_allergies(),
            "medications": self.collect_medications(),
            "implants": self.collect_implants(),
            "medical_conditions": self.collect_medical_conditions()
        }

        # 确定卡片类型
        if not variant:
            variant = self.determine_variant(self.card_data)

        # 元数据
        now = datetime.now()
        self.card_data["metadata"] = {
            "generated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
            "expires_at": (now + timedelta(days=90)).strftime("%Y-%m-%d"),
            "variant": variant,
            "print_size": print_size
        }

        print(f"正在生成HTML卡片 (类型: {variant}, 尺寸: {print_size})...")

        # 生成HTML
        html_content = self._render_html()

        # 保存文件
        filename = f"emergency-card-{variant}-{now.strftime('%Y-%m-%d')}.html"
        output_path = Path("emergency-cards") / filename
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ 紧急医疗信息卡已生成: {output_path.absolute()}")
        print(f"\n打开方式: 在浏览器中打开该文件，然后打印或另存为PDF")

        return str(output_path.absolute())

    def _get_variant_badge(self) -> str:
        """获取卡片类型标签"""
        variant = self.card_data["metadata"]["variant"]
        badges = {
            "standard": '<span class="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">标准版</span>',
            "child": '<span class="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">儿童版</span>',
            "elderly": '<span class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">老年版</span>',
            "severe": '<span class="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">严重过敏</span>'
        }
        return badges.get(variant, badges["standard"])

    def _render_html(self) -> str:
        """渲染完整的HTML内容"""
        metadata = self.card_data.get("metadata", {})
        basic_info = self.card_data.get("basic_info", {})
        critical_allergies = self.card_data.get("critical_allergies", [])
        medications = self.card_data.get("medications", [])
        implants = self.card_data.get("implants", [])
        medical_conditions = self.card_data.get("medical_conditions", [])

        # 检查是否有严重过敏（用于决定是否显示过敏警告）
        has_critical_allergies = len(critical_allergies) > 0

        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>紧急医疗信息卡 - {basic_info.get('name', '未设置')}</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

    <style>
        {self._get_print_css()}
    </style>

    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        medical: {{
                            primary: '#0284c7',
                            danger: '#dc2626',
                            warning: '#ca8a04',
                            success: '#16a34a'
                        }}
                    }}
                }}
            }}
        }}
    </script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8 max-w-4xl">

        <!-- 标题栏 -->
        <header class="bg-medical-primary text-white p-6 rounded-t-lg shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold flex items-center gap-3">
                        <i data-lucide="heart-pulse" class="w-8 h-8"></i>
                        紧急医疗信息卡
                    </h1>
                    <p class="mt-2 text-blue-100">
                        <i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i>
                        生成: {metadata.get('generated_at', '')}
                        <span class="mx-2">|</span>
                        过期: {metadata.get('expires_at', '')}
                    </p>
                </div>
                <div class="text-right">
                    {self._get_variant_badge()}
                </div>
            </div>
        </header>

        <!-- 基本信息卡片 -->
        <section class="bg-white p-6 border-b shadow-sm">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-4xl font-bold text-gray-900">{basic_info.get('name', '未设置')}</div>
                    <div class="text-gray-600 mt-1">姓名</div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-3xl font-bold text-medical-primary">{basic_info.get('age', '-')} 岁</div>
                    <div class="text-gray-600 text-sm mt-1">年龄 / {basic_info.get('gender', '未设置')}</div>
                </div>
                <div class="text-center p-4 bg-red-50 rounded-lg">
                    <div class="text-3xl font-bold text-medical-danger">{basic_info.get('blood_type', '未知')}</div>
                    <div class="text-gray-600 text-sm mt-1">血型</div>
                </div>
                <div class="text-center">
                    <div class="text-xl font-bold text-gray-900">{basic_info.get('weight', '-')}</div>
                    <div class="text-gray-600 text-sm mt-1">体重 / 身高</div>
                </div>
            </div>
        </section>

        {self._render_allergies_section()}

        {self._render_medications_section()}

        {self._render_conditions_section()}

        {self._render_implants_section()}

        {self._render_emergency_contacts_section()}

        <!-- 免责声明 -->
        <footer class="bg-yellow-50 border-t border-yellow-200 p-6 rounded-b-lg">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                免责声明
            </h3>
            <p class="text-yellow-700 text-sm leading-relaxed">
                此信息卡仅供参考，不替代专业医疗诊断。所有诊疗决策需咨询专业医生。
                <br><br>
                • 数据来源: my-his个人健康信息系统<br>
                • 建议每3个月更新一次，或健康信息变化后立即更新<br>
                • 如有严重过敏，请随身携带此卡并告知医护人员
            </p>
            <p class="text-gray-600 text-xs mt-4">
                生成时间: {metadata.get('generated_at', '')} | 过期时间: {metadata.get('expires_at', '')}
            </p>
        </footer>

    </div>

    <!-- 打印按钮（仅屏幕显示） -->
    <div class="no-print fixed bottom-8 right-8">
        <button onclick="window.print()"
                class="bg-medical-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <i data-lucide="printer" class="w-5 h-5"></i>
            打印卡片
        </button>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            lucide.createIcons();
        }});
    </script>
</body>
</html>
        """
        return html

    def _get_print_css(self) -> str:
        """获取打印CSS样式"""
        print_size = self.card_data.get("metadata", {}).get("print_size", "a4")

        # 基础打印CSS
        base_css = """
        body {
            font-family: 'Helvetica Neue', 'Arial', 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            color: #1f2937;
        }

        .card {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
        }

        @media print {
            .no-print {
                display: none !important;
            }

            .critical-section {
                page-break-inside: avoid;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            body {
                font-size: 12pt;
            }

            .card {
                box-shadow: none !important;
                border: 1px solid #e5e7eb;
            }
        }
        """

        # 尺寸特定CSS
        if print_size == "wallet":
            return base_css + """
            @media print {
                @page {
                    size: 74mm 105mm;
                    margin: 5mm;
                }
                body {
                    font-size: 8pt;
                    transform: scale(0.7);
                    transform-origin: top left;
                }
                .container {
                    max-width: 100% !important;
                }
            }
            """
        elif print_size == "large":
            return base_css + """
            @media print {
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
                body {
                    font-size: 16pt;
                }
                h1 {
                    font-size: 28pt !important;
                }
                h2 {
                    font-size: 22pt !important;
                }
                .text-3xl {
                    font-size: 24pt !important;
                }
                .text-4xl {
                    font-size: 32pt !important;
                }
            }
            """
        else:  # a4
            return base_css + """
            @media print {
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
            }
            """

    def _render_allergies_section(self) -> str:
        """渲染严重过敏章节"""
        critical_allergies = self.card_data.get("critical_allergies", [])

        if not critical_allergies:
            return """
            <section class="bg-green-50 border-l-4 border-green-500 p-6 border-b">
                <h2 class="text-xl font-bold text-green-700 flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-6 h-6"></i>
                    过敏信息
                </h2>
                <p class="text-gray-700 mt-2">未记录严重过敏（3-4级）</p>
            </section>
            """

        allergies_html = ""
        for allergy in critical_allergies:
            severity_class = "bg-red-600" if allergy["severity_level"] == 4 else "bg-orange-500"
            allergies_html += f"""
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-600 mb-3">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="text-2xl font-bold text-gray-900">{allergy['allergen']}</div>
                        <div class="mt-2 text-gray-700">
                            <p><strong>反应:</strong> {allergy['reaction']}</p>
                            <p><strong>诊断日期:</strong> {allergy['diagnosed_date']}</p>
                        </div>
                    </div>
                    <span class="{severity_class} text-white px-4 py-2 rounded-lg font-bold text-lg whitespace-nowrap ml-4">
                        {allergy['severity_text']} ({allergy['severity_level']}级)
                    </span>
                </div>
            </div>
            """

        return f"""
        <section class="bg-red-50 p-6 border-b critical-section">
            <h2 class="text-2xl font-bold text-red-600 flex items-center gap-2 mb-4">
                <i data-lucide="shield-alert" class="w-7 h-7"></i>
                严重过敏（危及生命）
            </h2>
            {allergies_html}
        </section>
        """

    def _render_medications_section(self) -> str:
        """渲染用药章节"""
        medications = self.card_data.get("medications", [])

        if not medications:
            return """
            <section class="bg-white p-6 border-b">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <i data-lucide="pill" class="w-6 h-6"></i>
                    当前用药
                </h2>
                <p class="text-gray-600">未记录当前用药</p>
            </section>
            """

        meds_html = ""
        for med in medications:
            meds_html += f"""
            <div class="flex items-start gap-4 p-3 bg-gray-50 rounded-lg mb-2">
                <i data-lucide="pill" class="w-5 h-5 text-medical-primary mt-1 flex-shrink-0"></i>
                <div class="flex-1">
                    <div class="font-bold text-lg text-gray-900">{med['name']}</div>
                    <div class="text-gray-700 mt-1">
                        <span class="mr-4"><strong>剂量:</strong> {med['dosage']}</span>
                        <span class="mr-4"><strong>频率:</strong> {med['frequency']}</span>
                    </div>
                    {f'<div class="text-gray-600 text-sm mt-1">{med["instructions"]}</div>' if med.get('instructions') else ''}
                    {f'<div class="text-medical-warning text-sm mt-1"><strong>用途:</strong> {med["purpose"]}</div>' if med.get('purpose') else ''}
                </div>
            </div>
            """

        return f"""
        <section class="bg-white p-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <i data-lucide="pill" class="w-6 h-6"></i>
                当前用药（{len(medications)}种）
            </h2>
            {meds_html}
        </section>
        """

    def _render_conditions_section(self) -> str:
        """渲染医疗状况章节"""
        conditions = self.card_data.get("medical_conditions", [])

        if not conditions:
            return ""

        conditions_html = ""
        for condition in conditions[:10]:  # 最多显示10个
            conditions_html += f"""
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                <i data-lucide="activity" class="w-5 h-5 text-medical-warning flex-shrink-0"></i>
                <div class="flex-1">
                    <div class="font-semibold text-gray-900">{condition['condition']}</div>
                    <div class="text-gray-600 text-sm">
                        <span>诊断: {condition['diagnosis_date']}</span>
                        <span class="ml-3">状态: {condition['status']}</span>
                    </div>
                </div>
            </div>
            """

        return f"""
        <section class="bg-white p-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <i data-lucide="heart-pulse" class="w-6 h-6"></i>
                医疗状况（{len(conditions)}项）
            </h2>
            {conditions_html}
        </section>
        """

    def _render_implants_section(self) -> str:
        """渲染植入物章节"""
        implants = self.card_data.get("implants", [])

        if not implants:
            return ""

        implants_html = ""
        for implant in implants:
            implants_html += f"""
            <div class="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg mb-3">
                <div class="flex items-start gap-3">
                    <i data-lucide="cog" class="w-5 h-5 text-orange-600 mt-1 flex-shrink-0"></i>
                    <div class="flex-1">
                        <div class="font-bold text-lg text-gray-900">{implant['type']}</div>
                        <div class="text-gray-700 mt-1">
                            <p><strong>植入日期:</strong> {implant['date']}</p>
                            <p><strong>医院:</strong> {implant['hospital']}</p>
                            {f'<p class="text-orange-700 mt-1"><strong>注意:</strong> {implant["notes"]}</p>' if implant.get('notes') else ''}
                        </div>
                    </div>
                </div>
            </div>
            """

        return f"""
        <section class="bg-orange-50 p-6 border-b">
            <h2 class="text-xl font-bold text-orange-700 flex items-center gap-2 mb-4">
                <i data-lucide="cog" class="w-6 h-6"></i>
                植入物（{len(implants)}项）
            </h2>
            {implants_html}
        </section>
        """

    def _render_emergency_contacts_section(self) -> str:
        """渲染紧急联系人章节"""
        basic_info = self.card_data.get("basic_info", {})
        contacts = basic_info.get("emergency_contacts", [])

        if not contacts:
            return """
            <section class="bg-white p-6 border-b">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <i data-lucide="phone" class="w-6 h-6"></i>
                    紧急联系人
                </h2>
                <p class="text-gray-600">未设置紧急联系人</p>
            </section>
            """

        contacts_html = ""
        for contact in contacts:
            contacts_html += f"""
            <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-3">
                <i data-lucide="user" class="w-8 h-8 text-medical-primary flex-shrink-0"></i>
                <div class="flex-1">
                    <div class="font-bold text-lg text-gray-900">{contact.get('name', '未知')}</div>
                    <div class="text-gray-600">
                        <span class="mr-3">{contact.get('relationship', '')}</span>
                        <a href="tel:{contact.get('phone', '')}" class="text-medical-primary font-semibold">
                            {contact.get('phone', '')}
                        </a>
                    </div>
                </div>
            </div>
            """

        return f"""
        <section class="bg-white p-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <i data-lucide="phone" class="w-6 h-6"></i>
                紧急联系人（{len(contacts)}人）
            </h2>
            {contacts_html}
        </section>
        """


def main():
    """主函数"""
    import sys

    variant = sys.argv[1] if len(sys.argv) > 1 else None
    print_size = sys.argv[2] if len(sys.argv) > 2 else "a4"

    generator = EmergencyCardGenerator()
    generator.generate_emergency_card(variant=variant, print_size=print_size)


if __name__ == "__main__":
    main()
