from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, log_loss, 
    mean_squared_error, mean_absolute_error, r2_score,
    precision_recall_curve, average_precision_score,
    matthews_corrcoef, cohen_kappa_score
)
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, Union, Optional, Tuple, List, Literal
from sklearn.metrics import roc_curve

TaskType = Literal['classification', 'regression', 'binary_classification', 'multiclass_classification']

class Metrics:
    """
    Example usage of the Metrics class:

    # For binary classification
    from metrics import Metrics

    ### Initialize metrics object
    metrics = Metrics()

    ### Set data and calculate metrics
    metrics.set_data(
        y_true=[0, 1, 0, 1, 1, 0, 1, 0], 
        y_pred=[0, 1, 1, 1, 0, 0, 1, 0],
        y_prob=[0.2, 0.9, 0.6, 0.8, 0.3, 0.1, 0.7, 0.2],
        task_type='binary_classification'
    ).calculate_all()

    ### Get metrics report
    print(metrics.get_report())

    ### Get metrics as dataframe
    df = metrics.get_report(format='dataframe')

    ### Visualize results
    fig = metrics.visualize(plot_type='all')
    fig.savefig('metrics_visualization.png')

    # For regression
    metrics_reg = Metrics()
    metrics_reg.set_data(
        y_true=[10.5, 20.1, 30.7, 40.2, 50.9],
        y_pred=[12.1, 19.8, 31.5, 38.9, 52.1],
        task_type='regression'
    ).calculate_all()

    print(metrics_reg.get_report())
    metrics_reg.visualize(plot_type='residuals')
    """
    
    def __init__(self):
        self.metrics = {}
        self.y_true = None
        self.y_pred = None
        self.y_prob = None
        self.task_type: Optional[TaskType] = None
    
    def set_data(self, y_true, y_pred, y_prob=None, task_type: Optional[TaskType]=None):
        """Set the ground truth and prediction data for metric calculation"""
        self.y_true = np.array(y_true)
        self.y_pred = np.array(y_pred)
        
        if y_prob is not None:
            self.y_prob = np.array(y_prob)
        
        if task_type is not None:
            self.task_type = task_type
        else:
            unique_vals = np.unique(self.y_true)
            if len(unique_vals) < 10 and np.all(np.equal(np.mod(unique_vals, 1), 0)):
                if len(unique_vals) == 2:
                    self.task_type = 'binary_classification'
                else:
                    self.task_type = 'multiclass_classification'
            else:
                self.task_type = 'regression'
        
        return self

    def add_metric(self, metric_name, metric_value):
        self.metrics[metric_name] = metric_value
        return self
    
    def calculate_all(self) -> Dict[str, float]:
        """Calculate all relevant metrics based on task type"""
        if self.y_true is None or self.y_pred is None:
            raise ValueError("Must set data with set_data() before calculating metrics")
        
        if self.task_type in ('classification', 'binary_classification', 'multiclass_classification'):
            self._calculate_classification_metrics()
        else:
            self._calculate_regression_metrics()
            
        return self.metrics
    
    def _calculate_classification_metrics(self):
        """Calculate classification metrics"""
        self.metrics['accuracy'] = accuracy_score(self.y_true, self.y_pred)
        
        is_binary = self.task_type == 'binary_classification' or (
            self.task_type == 'classification' and len(np.unique(self.y_true)) == 2
        )
        
        if is_binary:
            self.metrics['precision'] = precision_score(self.y_true, self.y_pred, average='binary')
            self.metrics['recall'] = recall_score(self.y_true, self.y_pred, average='binary')
            self.metrics['f1'] = f1_score(self.y_true, self.y_pred, average='binary')
            self.metrics['mcc'] = matthews_corrcoef(self.y_true, self.y_pred)
            
            cm = confusion_matrix(self.y_true, self.y_pred)
            tn, fp, fn, tp = cm.ravel()
            sensitivity = tp / (tp + fn)
            specificity = tn / (tn + fp)
            self.metrics['sensitivity'] = sensitivity
            self.metrics['specificity'] = specificity
            
            acc = self.metrics['accuracy']
            d_index = np.log2(1 + acc) + np.log2(1 + (sensitivity + specificity) / 2)
            self.metrics['d_index'] = d_index
            
            if self.y_prob is not None:
                prob_scores = self.y_prob[:, 1] if self.y_prob.ndim > 1 else self.y_prob
                self.metrics['roc_auc'] = roc_auc_score(self.y_true, prob_scores)
                self.metrics['log_loss'] = log_loss(self.y_true, prob_scores)
                self.metrics['average_precision'] = average_precision_score(self.y_true, prob_scores)
                self.metrics['categorical_crossentropy'] = log_loss(self.y_true, prob_scores)
        
        else:
            self.metrics['precision_macro'] = precision_score(self.y_true, self.y_pred, average='macro')
            self.metrics['recall_macro'] = recall_score(self.y_true, self.y_pred, average='macro')
            self.metrics['f1_macro'] = f1_score(self.y_true, self.y_pred, average='macro')
            self.metrics['precision_weighted'] = precision_score(self.y_true, self.y_pred, average='weighted')
            self.metrics['recall_weighted'] = recall_score(self.y_true, self.y_pred, average='weighted')
            self.metrics['f1_weighted'] = f1_score(self.y_true, self.y_pred, average='weighted')
            
            cm = confusion_matrix(self.y_true, self.y_pred)
            n_classes = cm.shape[0]
            sensitivities = []
            specificities = []
            
            for i in range(n_classes):
                tp = cm[i, i]
                fn = np.sum(cm[i, :]) - tp
                fp = np.sum(cm[:, i]) - tp
                tn = np.sum(cm) - tp - fp - fn
                
                sens_i = tp / (tp + fn) if (tp + fn) > 0 else 0
                spec_i = tn / (tn + fp) if (tn + fp) > 0 else 0
                
                sensitivities.append(sens_i)
                specificities.append(spec_i)
            
            avg_sensitivity = np.mean(sensitivities)
            avg_specificity = np.mean(specificities)
            self.metrics['sensitivity_macro'] = avg_sensitivity
            self.metrics['specificity_macro'] = avg_specificity
            
            acc = self.metrics['accuracy']
            d_index = np.log2(1 + acc) + np.log2(1 + (avg_sensitivity + avg_specificity) / 2)
            self.metrics['d_index'] = d_index
            
            if self.y_prob is not None:
                self.metrics['log_loss'] = log_loss(self.y_true, self.y_prob)
                self.metrics['categorical_crossentropy'] = log_loss(self.y_true, self.y_prob)
        
        self.metrics['cohen_kappa'] = cohen_kappa_score(self.y_true, self.y_pred)
        cm = confusion_matrix(self.y_true, self.y_pred)
        self.metrics['confusion_matrix'] = cm
        
    def _calculate_regression_metrics(self):
        """Calculate regression metrics"""
        self.metrics['mse'] = mean_squared_error(self.y_true, self.y_pred)
        self.metrics['rmse'] = np.sqrt(self.metrics['mse'])
        self.metrics['mae'] = mean_absolute_error(self.y_true, self.y_pred)
        self.metrics['r2'] = r2_score(self.y_true, self.y_pred)
        self.metrics['explained_variance'] = np.var(self.y_pred) / np.var(self.y_true)
        
        with np.errstate(divide='ignore', invalid='ignore'):
            mape = np.mean(np.abs((self.y_true - self.y_pred) / self.y_true)) * 100
            self.metrics['mape'] = mape if not np.isinf(mape) and not np.isnan(mape) else None
    
    def get_report(self, format='text') -> Union[str, pd.DataFrame]:
        """Get a formatted report of the metrics"""
        if not self.metrics:
            self.calculate_all()
            
        if format == 'dataframe':
            metrics_dict = {k: v for k, v in self.metrics.items() 
                           if not isinstance(v, (np.ndarray, list, tuple))}
            return pd.DataFrame(metrics_dict.items(), columns=['Metric', 'Value'])
        else:
            report = "=== Model Performance Metrics ===\n"
            for name, value in self.metrics.items():
                if isinstance(value, (np.ndarray, list, tuple)):
                    report += f"{name}: [complex data - see metrics dictionary]\n"
                else:
                    report += f"{name}: {value:.4f}\n"
            return report
          
    def visualize(self, plot_type: str = 'all', figsize: Tuple[int, int] = (12, 8)):
        """Generate visualizations for the metrics.
        
        Args:
            plot_type: Type of plot to generate ('confusion', 'roc', 'pr_curve', 'residuals', 'all')
            figsize: Size of the figure to create
            
        Returns:
            The matplotlib figure object
        """
        if not self.metrics:
            self.calculate_all()
            
        if plot_type == 'all':
            if self.task_type in ('classification', 'binary_classification', 'multiclass_classification'):
                fig, axes = plt.subplots(1, 2, figsize=figsize)
                self._plot_confusion_matrix(ax=axes[0])
                
                if self.task_type == 'binary_classification' and self.y_prob is not None:
                    self._plot_roc_curve(ax=axes[1])
                else:
                    axes[1].set_visible(False)
            else:
                fig, axes = plt.subplots(1, 2, figsize=figsize)
                self._plot_residuals(ax=axes[0])
                self._plot_prediction_vs_actual(ax=axes[1])
                
        elif plot_type == 'confusion':
            fig, ax = plt.subplots(figsize=figsize)
            self._plot_confusion_matrix(ax=ax)
            
        elif plot_type == 'roc' and self.task_type == 'binary_classification' and self.y_prob is not None:
            fig, ax = plt.subplots(figsize=figsize)
            self._plot_roc_curve(ax=ax)
            
        elif plot_type == 'pr_curve' and self.task_type == 'binary_classification' and self.y_prob is not None:
            fig, ax = plt.subplots(figsize=figsize)
            self._plot_precision_recall_curve(ax=ax)
            
        elif plot_type == 'residuals' and self.task_type == 'regression':
            fig, ax = plt.subplots(figsize=figsize)
            self._plot_residuals(ax=ax)
            
        elif plot_type == 'prediction_vs_actual' and self.task_type == 'regression':
            fig, ax = plt.subplots(figsize=figsize)
            self._plot_prediction_vs_actual(ax=ax)
            
        else:
            raise ValueError(f"Invalid plot type '{plot_type}' for task type '{self.task_type}'")
            
        plt.tight_layout()
        return fig
    
    def _plot_confusion_matrix(self, ax=None):
        """Plot confusion matrix"""
        if ax is None:
            _, ax = plt.subplots(figsize=(8, 6))
            
        cm = self.metrics.get('confusion_matrix')
        if cm is None:
            cm = confusion_matrix(self.y_true, self.y_pred)
            
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')
        ax.set_title('Confusion Matrix')
        return ax
    
    def _plot_roc_curve(self, ax=None):
        """Plot ROC curve for binary classification"""
        if ax is None:
            _, ax = plt.subplots(figsize=(8, 6))
            
        if self.y_prob is None:
            raise ValueError("Probability scores required for ROC curve")
            
        prob_scores = self.y_prob[:, 1] if self.y_prob.ndim > 1 else self.y_prob
        fpr, tpr, _ = roc_curve(self.y_true, prob_scores)
        roc_auc = self.metrics.get('roc_auc', roc_auc_score(self.y_true, prob_scores))
        
        ax.plot(fpr, tpr, label=f'ROC Curve (AUC = {roc_auc:.3f})')
        ax.plot([0, 1], [0, 1], 'k--', label='Random')
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel('False Positive Rate')
        ax.set_ylabel('True Positive Rate')
        ax.set_title('Receiver Operating Characteristic')
        ax.legend(loc='lower right')
        return ax
    
    def _plot_precision_recall_curve(self, ax=None):
        """Plot precision-recall curve for binary classification"""
        if ax is None:
            _, ax = plt.subplots(figsize=(8, 6))
            
        if self.y_prob is None:
            raise ValueError("Probability scores required for precision-recall curve")
            
        prob_scores = self.y_prob[:, 1] if self.y_prob.ndim > 1 else self.y_prob
        precision, recall, _ = precision_recall_curve(self.y_true, prob_scores)
        ap = self.metrics.get('average_precision', average_precision_score(self.y_true, prob_scores))
        
        ax.plot(recall, precision, label=f'PR Curve (AP = {ap:.3f})')
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel('Recall')
        ax.set_ylabel('Precision')
        ax.set_title('Precision-Recall Curve')
        ax.legend(loc='lower left')
        return ax
    
    def _plot_residuals(self, ax=None):
        """Plot residuals for regression"""
        if ax is None:
            _, ax = plt.subplots(figsize=(8, 6))
            
        residuals = self.y_true - self.y_pred
        ax.scatter(self.y_pred, residuals, alpha=0.5)
        ax.axhline(y=0, color='r', linestyle='-')
        ax.set_xlabel('Predicted Values')
        ax.set_ylabel('Residuals')
        ax.set_title('Residual Plot')
        return ax
    
    def _plot_prediction_vs_actual(self, ax=None):
        """Plot predicted vs actual values for regression"""
        if ax is None:
            _, ax = plt.subplots(figsize=(8, 6))
            
        ax.scatter(self.y_true, self.y_pred, alpha=0.5)
        
        min_val = min(np.min(self.y_true), np.min(self.y_pred))
        max_val = max(np.max(self.y_true), np.max(self.y_pred))
        ax.plot([min_val, max_val], [min_val, max_val], 'r--')
        
        ax.set_xlabel('Actual Values')
        ax.set_ylabel('Predicted Values')
        ax.set_title(f'Predicted vs Actual (R² = {self.metrics.get("r2", 0):.3f})')
        return ax

