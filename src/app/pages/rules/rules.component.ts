import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { Rule } from '../../feature/rule/rule.interface';
import { RuleService } from '../../feature/rule/rule.service';

interface RuleGroup {
	category: string;
	rules: Rule[];
}

@Component({
	imports: [TranslateDirective],
	templateUrl: './rules.component.html',
	styleUrl: './rules.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
	private readonly _ruleService = inject(RuleService);

	protected readonly rules = this._ruleService.rules;
	protected readonly isLoading = this._ruleService.isLoading;
	protected readonly ruleGroups = computed(() => _groupRules(this.rules()));

	constructor() {
		effect(() => {
			this._ruleService.loadTranslations();
		});
	}
}

function _groupRules(rules: Rule[]): RuleGroup[] {
	const groups = new Map<string, Rule[]>();

	for (const rule of rules) {
		const group = groups.get(rule.category);

		if (group) {
			group.push(rule);
		} else {
			groups.set(rule.category, [rule]);
		}
	}

	return Array.from(groups, ([category, groupedRules]) => ({
		category,
		rules: groupedRules,
	}));
}
