import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from IPython.display import display

metric_mapping = {
    "fcp": "First Contentful Paint",
    "lcp": "Largest Contentful Paint",
    "cls": "Cumulative Layout Shift",
    "speedIndex": "Speed Index",
    "tbt": "Total Blocking Time",
    "accessibility": "Accessibility",
    "seo": "SEO",
    "performance": "Performance"
}

page_order = ["books", "orders", "cart", "success"]

def combined(metric: str, throttling_method: str, query: str, iteration_group: int):
    conn = sqlite3.connect("../../metrics.db")
    df = pd.read_sql_query(query, conn, params=(iteration_group, throttling_method))
    conn.close()

    if df.empty:
        print(f"No data found for iteration group {iteration_group}, throttling method {throttling_method}")
        return

    metric_name = metric_mapping.get(metric, metric.upper())
    fig, axes = plt.subplots(1, 2, figsize=(16, 8))

    # Boxplot
    sns.boxplot(ax=axes[0], x="page", y=metric, hue="rendering_type", data=df, showfliers=False, palette='pastel', order=page_order)
    axes[0].set_title(f"{metric_name} - {iteration_group} Iterationen - {throttling_method}")
    axes[0].set_xlabel("Page")
    axes[0].set_ylabel("Zeit in ms" if metric in ["fcp", "lcp", "tbt", "speedIndex"] else ("CLS" if metric == "cls" else "Bewertung (0-100)"))
    axes[0].grid(True, axis='y', alpha=0.5)
    handles, labels = axes[0].get_legend_handles_labels()
    axes[0].get_legend().remove()

    # Balkendiagramm
    mean_df = df.groupby(["page", "rendering_type"])[metric].mean().unstack().reset_index().melt('page', var_name='rendering_type', value_name='mean_value')
    sns.barplot(ax=axes[1], x="page", y="mean_value", hue="rendering_type", data=mean_df, palette='pastel', order=page_order)
    axes[1].set_title(f"{metric_name} - {iteration_group} Iterationen - {throttling_method}")
    axes[1].set_xlabel("Page")
    axes[1].set_ylabel("Zeit in ms" if metric in ["fcp", "lcp", "tbt", "speedIndex"] else ("CLS" if metric == "cls" else "Bewertung (0-100)"))
    axes[1].grid(True, axis='y', alpha=0.5)
    axes[1].get_legend().remove()
    
    fig.legend(handles, labels, title="Rendering Pattern", bbox_to_anchor=(0.5, 0.08), loc='lower center', ncol=2, borderaxespad=0.1, frameon=False)
    
    plt.subplots_adjust(left=0.05, right=0.95, bottom=0.2, top=0.92, wspace=0.15, hspace=0.2)
    plt.show()

def table(metric: str, throttling_method: str, query: str, iteration_group: int):
    conn = sqlite3.connect("../../metrics.db")
    df = pd.read_sql_query(query, conn, params=(iteration_group, throttling_method))
    conn.close()
    
    if df.empty:
        print(f"No data found for iteration group {iteration_group}, throttling method {throttling_method}")
        return
    
    metric_name = metric_mapping.get(metric, metric.upper())
    df['page_cat'] = pd.Categorical(df['page'], categories=page_order, ordered=True)

    summary = df.groupby(["rendering_type", "page_cat"], observed=False)[metric].agg(["mean", "std", "min", "max"]).round(2)
    summary_df = summary.reset_index()
    summary_df.columns = ["Rendering Pattern", "Page", "Mittelwert", "Std", "Min", "Max"]
    
    display(summary_df)