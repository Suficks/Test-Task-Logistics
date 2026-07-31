import styles from './panel.module.css';

export type PanelProps = React.HTMLAttributes<HTMLDivElement>;

export function Panel({ className, ...props }: PanelProps) {
	return (
		<div
			className={className ? `${styles.panel} ${className}` : styles.panel}
			{...props}
		/>
	);
}
