#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
综合健康报告生成器
生成包含多种数据可视化的HTML格式健康报告
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
import re


class HealthReportGenerator:
    """健康报告生成器主类"""

    def __init__(self, base_dir: str = "data"):
        self.base_dir = Path(base_dir)
        self.report_data = {}
        self.metadata = {}

    def parse_date_range(self, date_range: str) -> Tuple[datetime, datetime]:
        """
        解析时间范围参数

        Args:
            date_range: 时间范围字符串
                - "all": 所有数据
                - "last_month": 上个月
                - "last_quarter": 上季度
                - "last_year": 去年
                - "YYYY-MM-DD,YYYY-MM-DD": 自定义范围
                - "YYYY-MM-DD": 从某日期至今

        Returns:
            (start_date, end_date) 元组
        """
        now = datetime.now()
        today = now.date()

        if date_range == "all" or not date_range:
            # 所有数据：使用一个非常早的日期
            start_date = datetime(2000, 1, 1)
            end_date = datetime.now()
        elif date_range == "last_month":
            # 上个月（自然月）
            first_day_of_this_month = today.replace(day=1)
            last_month = first_day_of_this_month - timedelta(days=1)
            start_date = last_month.replace(day=1)
            end_date = datetime.combine(first_day_of_this_month - timedelta(days=1), datetime.max.time())
        elif date_range == "last_quarter":
            # 上季度（3个月）
            current_month = today.month
            quarter = (current_month - 1) // 3
            start_month = quarter * 3 + 1 - 3
            year = today.year if start_month > 0 else today.year - 1
            start_month = start_month if start_month > 0 else 12 + start_month
            start_date = datetime(year, start_month, 1)
            end_quarter_month = start_month + 2
            if end_quarter_month > 12:
                end_quarter_month -= 12
                year += 1
            last_day_of_quarter = 31 if end_quarter_month in [1, 3, 5, 7, 8, 10, 12] else 30 if end_quarter_month != 2 else 28
            end_date = datetime(year, end_quarter_month, last_day_of_quarter, 23, 59, 59)
        elif date_range == "last_year":
            # 去年
            start_date = datetime(today.year - 1, 1, 1)
            end_date = datetime(today.year - 1, 12, 31, 23, 59, 59)
        elif "," in date_range:
            # 自定义范围 YYYY-MM-DD,YYYY-MM-DD
            parts = date_range.split(",")
            start_date = datetime.strptime(parts[0].strip(), "%Y-%m-%d")
            if len(parts) > 1 and parts[1].strip():
                end_date = datetime.strptime(parts[1].strip(), "%Y-%m-%d")
                end_date = end_date.replace(hour=23, minute=59, second=59)
            else:
                end_date = datetime.now()
        else:
            # 从某日期至今 YYYY-MM-DD
            try:
                start_date = datetime.strptime(date_range.strip(), "%Y-%m-%d")
                end_date = datetime.now()
            except ValueError:
                # 如果解析失败，默认使用最近3个月
                start_date = now - timedelta(days=90)
                end_date = now

        return start_date, end_date

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

    def collect_profile_data(self) -> Dict:
        """收集患者基本信息"""
        profile = self.load_json("profile.json")
        if not profile:
            return {}

        return {
            "age": profile.get("calculated", {}).get("age"),
            "height": profile.get("basic_info", {}).get("height"),
            "weight": profile.get("basic_info", {}).get("weight"),
            "bmi": profile.get("calculated", {}).get("bmi"),
            "body_surface_area": profile.get("calculated", {}).get("body_surface_area"),
            "birth_date": profile.get("basic_info", {}).get("birth_date")
        }

    def collect_biochemical_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集生化检查数据"""
        index = self.load_json("index.json")
        if not index:
            return {}

        exams = []
        index_list = index.get("biochemical_exams", [])

        for record in index_list:
            try:
                exam_date = datetime.strptime(record.get("date", ""), "%Y-%m-%d")
                if start_date <= exam_date <= end_date:
                    exam_data = self.load_json(record.get("file_path", ""))
                    if exam_data:
                        exams.append(exam_data)
            except ValueError:
                continue

        # 聚合指标趋势
        indicator_trends = {}
        abnormal_count = 0

        for exam in exams:
            for item in exam.get("items", []):
                indicator_name = item.get("name")
                if indicator_name not in indicator_trends:
                    indicator_trends[indicator_name] = []

                indicator_trends[indicator_name].append({
                    "date": exam.get("date"),
                    "value": float(item.get("value", 0)),
                    "unit": item.get("unit", ""),
                    "min_ref": float(item.get("min_ref", 0)),
                    "max_ref": float(item.get("max_ref", 100)),
                    "is_abnormal": item.get("is_abnormal", False)
                })

                if item.get("is_abnormal", False):
                    abnormal_count += 1

        # 排序趋势数据
        for indicator in indicator_trends:
            indicator_trends[indicator].sort(key=lambda x: x["date"])

        return {
            "exams": exams,
            "trends": indicator_trends,
            "abnormal_count": abnormal_count,
            "exam_count": len(exams)
        }

    def collect_imaging_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集影像检查数据"""
        index = self.load_json("index.json")
        if not index:
            return {}

        exams = []
        index_list = index.get("imaging_exams", [])

        for record in index_list:
            try:
                exam_date = datetime.strptime(record.get("date", ""), "%Y-%m-%d")
                if start_date <= exam_date <= end_date:
                    exam_data = self.load_json(record.get("file_path", ""))
                    if exam_data:
                        exams.append(exam_data)
            except ValueError:
                continue

        # 统计检查类型分布
        type_distribution = {}
        body_part_distribution = {}

        for exam in exams:
            exam_type = exam.get("type", "未知")
            type_distribution[exam_type] = type_distribution.get(exam_type, 0) + 1

            body_part = exam.get("body_part", "未知")
            body_part_distribution[body_part] = body_part_distribution.get(body_part, 0) + 1

        return {
            "exams": exams,
            "type_distribution": type_distribution,
            "body_part_distribution": body_part_distribution,
            "exam_count": len(exams)
        }

    def collect_medication_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集用药数据和日志"""
        # 加载当前用药
        medications_data = self.load_json("medications/medications.json")
        current_medications = medications_data.get("medications", []) if medications_data else []

        # 收集活跃药物
        active_medications = [med for med in current_medications if med.get("active", True)]

        # 加载用药日志
        logs = []
        logs_dir = self.base_dir / "medication-logs"

        if logs_dir.exists():
            # 遍历所有月份目录
            for month_dir in sorted(logs_dir.glob("*-*")):
                if not month_dir.is_dir():
                    continue

                for log_file in month_dir.glob("*.json"):
                    try:
                        log_date = datetime.strptime(log_file.stem, "%Y-%m-%d")
                        if start_date <= log_date <= end_date:
                            log_data = self.load_json(f"medication-logs/{month_dir.name}/{log_file.name}")
                            if log_data:
                                logs.extend(log_data.get("logs", []))
                    except ValueError:
                        continue

        # 计算依从性
        total_logs = len(logs)
        taken_logs = len([log for log in logs if log.get("status") == "taken"])
        missed_logs = len([log for log in logs if log.get("status") == "missed"])

        adherence_rate = (taken_logs / total_logs * 100) if total_logs > 0 else 100

        return {
            "current_medications": active_medications,
            "medication_count": len(active_medications),
            "logs": logs,
            "total_logs": total_logs,
            "taken_logs": taken_logs,
            "missed_logs": missed_logs,
            "adherence_rate": round(adherence_rate, 1)
        }

    def collect_radiation_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集辐射记录"""
        radiation_data = self.load_json("radiation-records.json")
        if not radiation_data:
            return {}

        records = radiation_data.get("records", [])

        # 过滤时间范围
        filtered_records = []
        cumulative_dose = 0

        for record in records:
            try:
                exam_date = datetime.strptime(record.get("exam_date", ""), "%Y-%m-%d")
                if start_date <= exam_date <= end_date:
                    filtered_records.append(record)
                    cumulative_dose += float(record.get("actual_dose", record.get("standard_dose", 0)))
            except ValueError:
                continue

        # 按月份统计剂量
        monthly_doses = {}
        for record in filtered_records:
            try:
                exam_date = datetime.strptime(record.get("exam_date", ""), "%Y-%m-%d")
                month_key = exam_date.strftime("%Y-%m")
                dose = float(record.get("actual_dose", record.get("standard_dose", 0)))
                monthly_doses[month_key] = monthly_doses.get(month_key, 0) + dose
            except ValueError:
                continue

        # 按检查类型统计
        type_distribution = {}
        for record in filtered_records:
            exam_type = record.get("exam_type", "未知")
            dose = float(record.get("actual_dose", record.get("standard_dose", 0)))
            type_distribution[exam_type] = type_distribution.get(exam_type, 0) + dose

        return {
            "records": filtered_records,
            "record_count": len(filtered_records),
            "cumulative_dose": round(cumulative_dose, 2),
            "monthly_doses": monthly_doses,
            "type_distribution": type_distribution
        }

    def collect_allergy_data(self) -> Dict:
        """收集过敏数据"""
        allergy_data = self.load_json("allergies.json")
        if not allergy_data:
            return {}

        allergies = allergy_data.get("allergies", [])

        # 按严重程度分类
        severity_distribution = {0: [], 1: [], 2: [], 3: [], 4: []}
        type_distribution = {"drug": 0, "food": 0, "environmental": 0, "other": 0}

        for allergy in allergies:
            severity = allergy.get("severity", {}).get("level_code", 0)
            severity_distribution[severity].append(allergy)

            allergen_type = allergy.get("allergen", {}).get("type", "other")
            type_distribution[allergen_type] = type_distribution.get(allergen_type, 0) + 1

        return {
            "allergies": allergies,
            "allergy_count": len(allergies),
            "severity_distribution": severity_distribution,
            "type_distribution": type_distribution
        }

    def collect_symptom_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集症状记录"""
        symptoms = []
        symptoms_dir = self.base_dir / "症状记录"

        if symptoms_dir.exists():
            for month_dir in sorted(symptoms_dir.glob("*-*")):
                if not month_dir.is_dir():
                    continue

                for symptom_file in month_dir.glob("*.json"):
                    try:
                        symptom_date = datetime.strptime(symptom_file.stem, "%Y-%m-%d")
                        if start_date <= symptom_date <= end_date:
                            symptom_data = self.load_json(f"症状记录/{month_dir.name}/{symptom_file.name}")
                            if symptom_data:
                                symptoms.append(symptom_data)
                    except ValueError:
                        continue

        # 统计症状频率
        symptom_frequency = {}
        for symptom in symptoms:
            symptom_name = symptom.get("standardized_data", {}).get("symptom_name", "未知")
            symptom_frequency[symptom_name] = symptom_frequency.get(symptom_name, 0) + 1

        return {
            "symptoms": symptoms,
            "symptom_count": len(symptoms),
            "symptom_frequency": symptom_frequency
        }

    def collect_surgery_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集手术记录"""
        surgeries = []
        surgeries_dir = self.base_dir / "手术记录"

        if surgeries_dir.exists():
            for month_dir in sorted(surgeries_dir.glob("*-*")):
                if not month_dir.is_dir():
                    continue

                for surgery_file in month_dir.glob("*.json"):
                    try:
                        surgery_date = datetime.strptime(surgery_file.stem, "%Y-%m-%d")
                        if start_date <= surgery_date <= end_date:
                            surgery_data = self.load_json(f"手术记录/{month_dir.name}/{surgery_file.name}")
                            if surgery_data:
                                surgeries.append(surgery_data)
                    except ValueError:
                        continue

        return {
            "surgeries": surgeries,
            "surgery_count": len(surgeries)
        }

    def collect_discharge_data(self, start_date: datetime, end_date: datetime) -> Dict:
        """收集出院小结"""
        discharges = []
        discharges_dir = self.base_dir / "出院小结"

        if discharges_dir.exists():
            for month_dir in sorted(discharges_dir.glob("*-*")):
                if not month_dir.is_dir():
                    continue

                for discharge_file in month_dir.glob("*.json"):
                    try:
                        discharge_date = datetime.strptime(discharge_file.stem, "%Y-%m-%d")
                        if start_date <= discharge_date <= end_date:
                            discharge_data = self.load_json(f"出院小结/{month_dir.name}/{discharge_file.name}")
                            if discharge_data:
                                discharges.append(discharge_data)
                    except ValueError:
                        continue

        return {
            "discharges": discharges,
            "discharge_count": len(discharges)
        }

    def calculate_trend(self, values: List[float]) -> Dict:
        """
        计算趋势方向和幅度

        Returns:
            包含 direction, change, slope, percent_change 的字典
        """
        if len(values) < 2:
            return {"direction": "stable", "change": 0, "slope": 0, "percent_change": 0}

        # 简单的线性回归
        n = len(values)
        x = list(range(n))
        y = values

        sum_x = sum(x)
        sum_y = sum(y)
        sum_xy = sum(xi * yi for xi, yi in zip(x, y))
        sum_x2 = sum(xi ** 2 for xi in x)

        if n * sum_x2 - sum_x ** 2 == 0:
            slope = 0
        else:
            slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x ** 2)

        # 确定方向
        if abs(slope) < 0.01:
            direction = "stable"
        elif slope > 0:
            direction = "increasing"
        else:
            direction = "decreasing"

        change = values[-1] - values[0] if values else 0
        percent_change = (change / values[0] * 100) if values and values[0] != 0 else 0

        return {
            "direction": direction,
            "change": round(change, 2),
            "slope": round(slope, 4),
            "percent_change": round(percent_change, 2)
        }

    def calculate_health_score(self, data: Dict) -> Dict:
        """
        计算整体健康评分 (0-100)

        评分因素：
        - 生化检查正常率 (0-30分)
        - 用药依从性 (0-20分)
        - 辐射安全 (0-15分)
        - 症状频率 (0-15分)
        - 过敏管理 (0-10分)
        - 定期检查 (0-10分)
        """
        scores = []

        # 1. 生化检查正常率
        if data.get("biochemical", {}).get("exam_count", 0) > 0:
            bio_data = data["biochemical"]
            total_items = sum(len(exam.get("items", [])) for exam in bio_data.get("exams", []))
            abnormal_count = bio_data.get("abnormal_count", 0)
            normal_ratio = 1 - (abnormal_count / max(1, total_items))
            scores.append(normal_ratio * 30)
        else:
            scores.append(15)  # 无数据时给一半分数

        # 2. 用药依从性
        if data.get("medication", {}).get("medication_count", 0) > 0:
            adherence_rate = data["medication"].get("adherence_rate", 100)
            scores.append((adherence_rate / 100) * 20)
        else:
            scores.append(20)  # 无用药时给满分

        # 3. 辐射安全
        cumulative_dose = data.get("radiation", {}).get("cumulative_dose", 0)
        if cumulative_dose < 10:
            scores.append(15)
        elif cumulative_dose < 50:
            scores.append(10)
        else:
            scores.append(5)

        # 4. 症状频率
        symptom_count = data.get("symptoms", {}).get("symptom_count", 0)
        if symptom_count == 0:
            scores.append(15)
        elif symptom_count < 5:
            scores.append(10)
        else:
            scores.append(5)

        # 5. 过敏管理
        allergy_count = data.get("allergies", {}).get("allergy_count", 0)
        if allergy_count == 0:
            scores.append(10)
        else:
            scores.append(5)

        # 6. 定期检查
        exam_count = data.get("biochemical", {}).get("exam_count", 0)
        if exam_count >= 4:  # 至少每季度一次
            scores.append(10)
        elif exam_count >= 2:
            scores.append(7)
        elif exam_count >= 1:
            scores.append(4)
        else:
            scores.append(0)

        overall_score = sum(scores)

        # 确定等级
        if overall_score >= 90:
            category = "excellent"
            category_text = "优秀"
            color = "#16a34a"  # 绿色
        elif overall_score >= 75:
            category = "good"
            category_text = "良好"
            color = "#0284c7"  # 蓝色
        elif overall_score >= 60:
            category = "fair"
            category_text = "一般"
            color = "#ca8a04"  # 黄色
        else:
            category = "needs_attention"
            category_text = "需关注"
            color = "#dc2626"  # 红色

        return {
            "score": round(overall_score),
            "category": category,
            "category_text": category_text,
            "color": color
        }

    def generate_insights(self, data: Dict) -> Dict:
        """生成报告洞察和建议"""
        insights = {
            "critical_findings": [],
            "recommendations": [],
            "health_score": self.calculate_health_score(data)
        }

        # 检查异常指标
        abnormal_count = data.get("biochemical", {}).get("abnormal_count", 0)
        if abnormal_count > 0:
            insights["critical_findings"].append({
                "type": "warning",
                "icon": "alert-triangle",
                "text": f"发现 {abnormal_count} 个异常生化指标需要关注"
            })

        # 检查严重过敏
        allergies = data.get("allergies", {}).get("allergies", [])
        severe_allergies = [a for a in allergies if a.get("severity", {}).get("level_code", 0) >= 3]
        if severe_allergies:
            insights["critical_findings"].append({
                "type": "danger",
                "icon": "shield-alert",
                "text": f"{len(severe_allergies)} 个严重过敏反应史，就诊时必须告知医生"
            })

        # 检查用药依从性
        adherence_rate = data.get("medication", {}).get("adherence_rate", 100)
        if adherence_rate < 80:
            insights["critical_findings"].append({
                "type": "warning",
                "icon": "pill",
                "text": f"用药依从性较低({adherence_rate}%)，建议设置用药提醒"
            })

        # 生成建议
        if abnormal_count > 0:
            insights["recommendations"].append("建议针对异常指标进行复查和随访")

        if adherence_rate < 90:
            insights["recommendations"].append("建议改善用药依从性，可使用闹钟或用药提醒APP")

        radiation_dose = data.get("radiation", {}).get("cumulative_dose", 0)
        if radiation_dose > 20:
            insights["recommendations"].append(f"本年度辐射剂量已达{radiation_dose}mSv，建议谨慎选择影像检查")

        return insights

    def generate_html_report(self, action: str, date_range_str: str,
                            sections: List[str], output_path: str) -> str:
        """
        生成HTML报告

        Args:
            action: 报告类型
            date_range_str: 时间范围字符串
            sections: 包含的章节列表
            output_path: 输出文件路径

        Returns:
            生成的HTML文件路径
        """
        # 解析时间范围
        start_date, end_date = self.parse_date_range(date_range_str)

        print(f"正在收集数据... (时间范围: {start_date.strftime('%Y-%m-%d')} 至 {end_date.strftime('%Y-%m-%d')})")

        # 收集所有数据
        self.report_data = {
            "metadata": {
                "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "date_range": {
                    "start": start_date.strftime("%Y-%m-%d"),
                    "end": end_date.strftime("%Y-%m-%d")
                },
                "sections": sections
            }
        }

        # 根据action确定默认章节
        if action == "comprehensive":
            sections = ["profile", "biochemical", "imaging", "medication",
                       "radiation", "allergies", "symptoms", "surgeries", "discharge"]
        elif action == "biochemical":
            sections = ["profile", "biochemical"]
        elif action == "imaging":
            sections = ["profile", "imaging"]
        elif action == "medication":
            sections = ["profile", "medication"]
        elif action == "custom":
            if not sections or sections == ["all"]:
                sections = ["profile", "biochemical", "imaging", "medication",
                           "radiation", "allergies", "symptoms", "surgeries", "discharge"]

        # 收集各章节数据
        if "profile" in sections:
            print("  - 收集患者概况...")
            self.report_data["profile"] = self.collect_profile_data()

        if "biochemical" in sections:
            print("  - 收集生化检查数据...")
            self.report_data["biochemical"] = self.collect_biochemical_data(start_date, end_date)

        if "imaging" in sections:
            print("  - 收集影像检查数据...")
            self.report_data["imaging"] = self.collect_imaging_data(start_date, end_date)

        if "medication" in sections:
            print("  - 收集用药数据...")
            self.report_data["medication"] = self.collect_medication_data(start_date, end_date)

        if "radiation" in sections:
            print("  - 收集辐射记录...")
            self.report_data["radiation"] = self.collect_radiation_data(start_date, end_date)

        if "allergies" in sections:
            print("  - 收集过敏数据...")
            self.report_data["allergies"] = self.collect_allergy_data()

        if "symptoms" in sections:
            print("  - 收集症状记录...")
            self.report_data["symptoms"] = self.collect_symptom_data(start_date, end_date)

        if "surgeries" in sections:
            print("  - 收集手术记录...")
            self.report_data["surgeries"] = self.collect_surgery_data(start_date, end_date)

        if "discharge" in sections:
            print("  - 收集出院小结...")
            self.report_data["discharge"] = self.collect_discharge_data(start_date, end_date)

        # 生成洞察
        print("正在生成洞察...")
        self.report_data["insights"] = self.generate_insights(self.report_data)

        # 生成HTML
        print("正在生成HTML报告...")
        html_content = self._render_html()

        # 确保输出目录存在
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # 保存文件
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ 报告已生成: {output_file.absolute()}")

        return str(output_file.absolute())

    def _render_html(self) -> str:
        """渲染完整的HTML报告内容"""
        metadata = self.report_data.get('metadata', {})
        insights = self.report_data.get('insights', {})
        health_score = insights.get('health_score', {})

        # 准备章节HTML
        sections_html = self._render_sections()

        # 准备图表数据
        charts_js = self._generate_charts_js()

        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>健康报告 - {metadata.get('generated_at', '')}</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

    <style>
        /* 医疗专业风格样式 */
        :root {{
            --medical-primary: #0284c7;
            --medical-success: #16a34a;
            --medical-warning: #ca8a04;
            --medical-danger: #dc2626;
            --medical-gray: #6b7280;
        }}

        body {{
            font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
        }}

        .card {{
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            transition: box-shadow 0.2s ease;
        }}

        .card:hover {{
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }}

        .chart-container {{
            position: relative;
            height: 400px;
            width: 100%;
        }}

        .chart-container-small {{
            position: relative;
            height: 300px;
            width: 100%;
        }}

        /* 打印优化 */
        @media print {{
            .no-print {{ display: none !important; }}
            .card, .chart-wrapper {{
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #e5e7eb;
            }}
            @page {{
                size: A4;
                margin: 1.5cm;
            }}
        }}

        /* 响应式设计 */
        @media (max-width: 639px) {{
            .chart-container {{ height: 250px !important; }}
            .chart-container-small {{ height: 200px !important; }}
        }}
    </style>

    <!-- Tailwind配置 -->
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        medical: {{
                            primary: '#0284c7',
                            success: '#16a34a',
                            warning: '#ca8a04',
                            danger: '#dc2626'
                        }}
                    }}
                }}
            }}
        }}
    </script>
</head>
<body>
    <div class="container mx-auto px-4 py-8 max-w-7xl">

        <!-- 报告标题 -->
        <header class="mb-8 pb-6 border-b-2 border-gray-200">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <i data-lucide="heart-pulse" class="w-10 h-10 text-medical-primary"></i>
                        综合健康报告
                    </h1>
                    <p class="text-gray-600 mt-2">
                        <i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i>
                        生成时间: {metadata.get('generated_at', '')}
                    </p>
                    <p class="text-gray-600">
                        <i data-lucide="clock" class="w-4 h-4 inline mr-1"></i>
                        数据范围: {metadata.get('date_range', {}).get('start', '')} 至 {metadata.get('date_range', {}).get('end', '')}
                    </p>
                </div>
            </div>
        </header>

        <!-- 患者概况卡片 -->
        {self._render_profile_card()}

        <!-- 执行摘要 -->
        <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="file-text" class="w-6 h-6"></i>
                执行摘要
            </h2>

            <!-- 健康评分 -->
            <div class="card">
                <h3 class="text-xl font-semibold mb-4">健康评分</h3>
                <div class="flex items-center gap-8">
                    <div class="text-center">
                        <div class="text-6xl font-bold" style="color: {health_score.get('color', '#0284c7')}">
                            {health_score.get('score', 0)}
                        </div>
                        <div class="text-gray-600 mt-2 text-lg">
                            等级: {health_score.get('category_text', '未知')}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="chart-container-small">
                            <canvas id="healthScoreChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 关键发现 -->
            {self._render_critical_findings()}

            <!-- 核心指标 -->
            {self._render_key_metrics()}
        </section>

        <!-- 各章节内容 -->
        {sections_html}

        <!-- 免责声明 -->
        <footer class="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                免责声明
            </h3>
            <p class="text-yellow-700 text-sm leading-relaxed">
                本报告仅供参考，不作为医疗诊断依据。所有诊疗决策需咨询专业医生。如有紧急情况，请立即就医。
                <br><br>
                • 所有数据仅保存在本地<br>
                • 不替代专业医生的诊断和建议<br>
                • 如有健康问题，请及时咨询医疗专业人士
            </p>
        </footer>

        <!-- 页脚信息 -->
        <div class="mt-8 text-center text-gray-500 text-sm">
            <p>Generated by HIS (Health Information System)</p>
            <p>{metadata.get('generated_at', '')}</p>
        </div>

    </div>

    <!-- 浮动导航（仅屏幕显示） -->
    <div class="no-print fixed right-8 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
        <nav class="space-y-2">
            <a href="#executive-summary" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">执行摘要</a>
            <a href="#biochemical" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">生化检查</a>
            <a href="#imaging" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">影像检查</a>
            <a href="#medication" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">用药分析</a>
            <a href="#" onclick="window.print(); return false;" class="block px-3 py-2 text-sm text-medical-primary hover:bg-gray-100 rounded">
                <i data-lucide="printer" class="w-4 h-4 inline mr-1"></i>打印
            </a>
        </nav>
    </div>

    <script>
        // 初始化Lucide图标
        document.addEventListener('DOMContentLoaded', () => {{
            lucide.createIcons();

            // 初始化所有图表
            {charts_js}
        }});

        // Chart.js全局配置
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend.position = 'top';
        Chart.defaults.plugins.tooltip.mode = 'index';
        Chart.defaults.plugins.tooltip.intersect = false;
    </script>
</body>
</html>
        """
        return html

    def _render_profile_card(self) -> str:
        """渲染患者概况卡片"""
        profile = self.report_data.get('profile', {})

        if not profile:
            return ""

        return f"""
        <div class="card mb-8">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <i data-lucide="user" class="w-5 h-5"></i>
                患者概况
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded">
                    <div class="text-3xl font-bold text-medical-primary">{profile.get('age', '-')} 岁</div>
                    <div class="text-gray-600 text-sm mt-1">年龄</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded">
                    <div class="text-3xl font-bold text-medical-success">{profile.get('height', '-')} cm</div>
                    <div class="text-gray-600 text-sm mt-1">身高</div>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded">
                    <div class="text-3xl font-bold text-medical-warning">{profile.get('weight', '-')} kg</div>
                    <div class="text-gray-600 text-sm mt-1">体重</div>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded">
                    <div class="text-3xl font-bold text-purple-600">{profile.get('bmi', '-')}</div>
                    <div class="text-gray-600 text-sm mt-1">BMI</div>
                </div>
            </div>
        </div>
        """

    def _render_critical_findings(self) -> str:
        """渲染关键发现"""
        insights = self.report_data.get('insights', {})
        findings = insights.get('critical_findings', [])

        if not findings:
            return '<div class="card"><p class="text-gray-600">暂无特别关注事项</p></div>'

        findings_html = ""
        for finding in findings:
            icon_color = "text-medical-danger" if finding.get('type') == 'danger' else "text-medical-warning"
            findings_html += f"""
            <div class="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <i data-lucide="{finding.get('icon', 'alert-triangle')}" class="w-5 h-5 {icon_color} mt-0.5"></i>
                <p class="text-gray-700">{finding.get('text', '')}</p>
            </div>
            """

        return f'<div class="card space-y-3">{findings_html}</div>'

    def _render_key_metrics(self) -> str:
        """渲染核心指标"""
        biochemical = self.report_data.get('biochemical', {})
        imaging = self.report_data.get('imaging', {})
        medication = self.report_data.get('medication', {})
        radiation = self.report_data.get('radiation', {})

        return f"""
        <div class="card">
            <h3 class="text-lg font-semibold mb-4">核心指标</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-medical-primary">{biochemical.get('exam_count', 0)}</div>
                    <div class="text-gray-600 text-sm">生化检查次数</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-medical-success">{imaging.get('exam_count', 0)}</div>
                    <div class="text-gray-600 text-sm">影像检查次数</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-medical-warning">{medication.get('medication_count', 0)}</div>
                    <div class="text-gray-600 text-sm">当前用药种类</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-medical-danger">{radiation.get('cumulative_dose', 0)}</div>
                    <div class="text-gray-600 text-sm">累积辐射 (mSv)</div>
                </div>
            </div>
        </div>
        """

    def _render_sections(self) -> str:
        """渲染所有数据章节"""
        sections_html = ""

        # 生化检查章节
        if self.report_data.get('biochemical'):
            sections_html += self._render_biochemical_section()

        # 影像检查章节
        if self.report_data.get('imaging'):
            sections_html += self._render_imaging_section()

        # 用药分析章节
        if self.report_data.get('medication'):
            sections_html += self._render_medication_section()

        # 辐射剂量章节
        if self.report_data.get('radiation'):
            sections_html += self._render_radiation_section()

        # 过敏章节
        if self.report_data.get('allergies'):
            sections_html += self._render_allergies_section()

        # 症状章节
        if self.report_data.get('symptoms'):
            sections_html += self._render_symptoms_section()

        # 手术章节
        if self.report_data.get('surgeries'):
            sections_html += self._render_surgeries_section()

        # 出院小结章节
        if self.report_data.get('discharge'):
            sections_html += self._render_discharge_section()

        return sections_html

    def _render_biochemical_section(self) -> str:
        """渲染生化检查章节"""
        data = self.report_data.get('biochemical', {})
        trends = data.get('trends', {})

        # 选择前5个有多个数据点的指标进行趋势展示
        trend_indicators = [(k, v) for k, v in trends.items() if len(v) > 1][:5]

        return f"""
        <section id="biochemical" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="test-tubes" class="w-6 h-6"></i>
                生化检查分析
            </h2>

            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">检查统计</h3>
                    <div class="flex gap-2">
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {data.get('exam_count', 0)} 次检查
                        </span>
                        <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            {data.get('abnormal_count', 0)} 项异常
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {self._render_trend_charts(trend_indicators, 'biochemical')}
                </div>
            </div>
        </section>
        """

    def _render_imaging_section(self) -> str:
        """渲染影像检查章节"""
        data = self.report_data.get('imaging', {})
        type_dist = data.get('type_distribution', {})
        body_part_dist = data.get('body_part_distribution', {})

        return f"""
        <section id="imaging" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="scan-face" class="w-6 h-6"></i>
                影像检查汇总
            </h2>

            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">检查统计</h3>
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {data.get('exam_count', 0)} 次检查
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-medium mb-3">检查类型分布</h4>
                        <div class="chart-container-small">
                            <canvas id="imagingTypeChart"></canvas>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-medium mb-3">检查部位分布</h4>
                        <div class="chart-container-small">
                            <canvas id="imagingBodyPartChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        """

    def _render_medication_section(self) -> str:
        """渲染用药分析章节"""
        data = self.report_data.get('medication', {})

        return f"""
        <section id="medication" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="pill" class="w-6 h-6"></i>
                用药分析
            </h2>

            <div class="card">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="text-center p-4 bg-blue-50 rounded">
                        <div class="text-2xl font-bold text-medical-primary">{data.get('medication_count', 0)}</div>
                        <div class="text-gray-600 text-sm">当前用药种类</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded">
                        <div class="text-2xl font-bold text-medical-success">{data.get('adherence_rate', 0)}%</div>
                        <div class="text-gray-600 text-sm">用药依从性</div>
                    </div>
                    <div class="text-center p-4 bg-yellow-50 rounded">
                        <div class="text-2xl font-bold text-medical-warning">{data.get('missed_logs', 0)}</div>
                        <div class="text-gray-600 text-sm">漏服次数</div>
                    </div>
                </div>

                <div class="chart-container">
                    <canvas id="medicationAdherenceChart"></canvas>
                </div>
            </div>
        </section>
        """

    def _render_radiation_section(self) -> str:
        """渲染辐射剂量章节"""
        data = self.report_data.get('radiation', {})

        return f"""
        <section id="radiation" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="radiation" class="w-6 h-6"></i>
                辐射剂量追踪
            </h2>

            <div class="card">
                <div class="flex items-center gap-8">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-medical-primary">{data.get('cumulative_dose', 0)}</div>
                        <div class="text-gray-600 mt-2">累积剂量 (mSv)</div>
                    </div>
                    <div class="flex-1">
                        <div class="chart-container-small">
                            <canvas id="radiationGaugeChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="mt-6">
                    <h4 class="font-medium mb-3">月度剂量趋势</h4>
                    <div class="chart-container-small">
                        <canvas id="radiationMonthlyChart"></canvas>
                    </div>
                </div>
            </div>
        </section>
        """

    def _render_allergies_section(self) -> str:
        """渲染过敏章节"""
        data = self.report_data.get('allergies', {})
        allergies = data.get('allergies', [])

        if not allergies:
            return ""

        allergy_items = ""
        for allergy in allergies:
            allergen_name = allergy.get('allergen', {}).get('name', '未知')
            severity = allergy.get('severity', {}).get('level', 0)
            severity_text = ['轻微', '轻度', '中度', '重度', '严重'][severity] if severity <= 4 else '严重'
            severity_color = ['green', 'blue', 'yellow', 'orange', 'red'][severity] if severity <= 4 else 'red'

            allergy_items += f"""
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span class="font-medium">{allergen_name}</span>
                <span class="px-2 py-1 bg-{severity_color}-100 text-{severity_color}-800 rounded text-sm">
                    {severity_text}
                </span>
            </div>
            """

        return f"""
        <section id="allergies" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="shield-alert" class="w-6 h-6"></i>
                过敏摘要
            </h2>

            <div class="card">
                <p class="mb-4 text-gray-600">共 {data.get('allergy_count', 0)} 个过敏记录</p>
                <div class="space-y-2">
                    {allergy_items}
                </div>
            </div>
        </section>
        """

    def _render_symptoms_section(self) -> str:
        """渲染症状章节"""
        data = self.report_data.get('symptoms', {})

        return f"""
        <section id="symptoms" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="thermometer" class="w-6 h-6"></i>
                症状历史
            </h2>

            <div class="card">
                <p class="mb-4 text-gray-600">共 {data.get('symptom_count', 0)} 次症状记录</p>
                <div class="chart-container">
                    <canvas id="symptomFrequencyChart"></canvas>
                </div>
            </div>
        </section>
        """

    def _render_surgeries_section(self) -> str:
        """渲染手术章节"""
        data = self.report_data.get('surgeries', {})

        return f"""
        <section id="surgeries" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="scalpel" class="w-6 h-6"></i>
                手术记录
            </h2>

            <div class="card">
                <p class="text-gray-600">共 {data.get('surgery_count', 0)} 次手术</p>
            </div>
        </section>
        """

    def _render_discharge_section(self) -> str:
        """渲染出院小结章节"""
        data = self.report_data.get('discharge', {})

        return f"""
        <section id="discharge" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="file-text" class="w-6 h-6"></i>
                出院小结
            </h2>

            <div class="card">
                <p class="text-gray-600">共 {data.get('discharge_count', 0)} 次住院记录</p>
            </div>
        </section>
        """

    def _render_trend_charts(self, indicators: list, section: str) -> str:
        """渲染趋势图表"""
        charts_html = ""

        for i, (indicator_name, trend_data) in enumerate(indicators[:4], 1):  # 最多显示4个
            chart_id = f"{section}Trend{i}"
            charts_html += f"""
            <div>
                <h4 class="font-medium mb-3">{indicator_name}</h4>
                <div class="chart-container-small">
                    <canvas id="{chart_id}"></canvas>
                </div>
            </div>
            """

        return charts_html

    def _generate_charts_js(self) -> str:
        """生成Chart.js配置的JavaScript代码"""
        js_parts = []

        # 健康评分仪表图
        health_score = self.report_data.get('insights', {}).get('health_score', {})
        score = health_score.get('score', 0)
        js_parts.append(f"""
        // 健康评分仪表图
        new Chart(document.getElementById('healthScoreChart'), {{
            type: 'doughnut',
            data: {{
                labels: ['已获得', '剩余'],
                datasets: [{{
                    data: [{score}, {100 - score}],
                    backgroundColor: ['{health_score.get('color', '#0284c7')}', '#e5e7eb'],
                    circumference: 270,
                    rotation: 225
                }}]
            }},
            options: {{
                cutout: '75%',
                plugins: {{
                    legend: {{ display: false }},
                    tooltip: {{ enabled: false }}
                }}
            }}
        }});
        """)

        # 影像检查类型分布图
        imaging = self.report_data.get('imaging', {})
        if imaging.get('type_distribution'):
            type_dist = imaging['type_distribution']
            labels = list(type_dist.keys())
            data = list(type_dist.values())
            js_parts.append(f"""
            new Chart(document.getElementById('imagingTypeChart'), {{
                type: 'pie',
                data: {{
                    labels: {labels},
                    datasets: [{{
                        data: {data},
                        backgroundColor: ['#0284c7', '#16a34a', '#ca8a04', '#dc2626', '#9333ea']
                    }}]
                }}
            }});
            """)

        # 生化趋势图
        biochemical = self.report_data.get('biochemical', {})
        trends = biochemical.get('trends', {})
        for i, (indicator_name, trend_data) in enumerate([(k, v) for k, v in trends.items() if len(v) > 1][:4], 1):
            dates = [d['date'] for d in trend_data]
            values = [d['value'] for d in trend_data]
            js_parts.append(f"""
            new Chart(document.getElementById('biochemicalTrend{i}'), {{
                type: 'line',
                data: {{
                    labels: {dates},
                    datasets: [{{
                        label: '{indicator_name}',
                        data: {values},
                        borderColor: '#0284c7',
                        backgroundColor: 'rgba(2, 132, 199, 0.1)',
                        fill: true,
                        tension: 0.3
                    }}]
                }}
            }});
            """)

        return "\n        ".join(js_parts)


def main():
    """主函数 - 命令行入口"""
    import sys

    if len(sys.argv) < 2:
        print("用法: python generate_health_report.py <action> [date_range] [sections] [output]")
        print("示例:")
        print("  python generate_health_report.py comprehensive")
        print("  python generate_health_report.py comprehensive last_quarter")
        print("  python generate_health_report.py custom 2024-01-01,2024-12-31 profile,biochemical,medication")
        sys.exit(1)

    action = sys.argv[1]
    date_range = sys.argv[2] if len(sys.argv) > 2 else "all"
    sections_str = sys.argv[3] if len(sys.argv) > 3 else None
    output = sys.argv[4] if len(sys.argv) > 4 else f"reports/health-report-{datetime.now().strftime('%Y-%m-%d')}.html"

    # 解析章节列表
    sections = sections_str.split(",") if sections_str else None

    # 创建生成器并生成报告
    generator = HealthReportGenerator()
    generator.generate_html_report(action, date_range, sections or [], output)


if __name__ == "__main__":
    main()
