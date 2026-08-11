/**
 * Diagram registry: block `diagram` id → Svelte component.
 */

import type { Component } from 'svelte';
import HarmonyCouncil from './HarmonyCouncil.svelte';
import BoneRank from './BoneRank.svelte';
import EightClans from './EightClans.svelte';
import RoyalSecretariat from './RoyalSecretariat.svelte';
import TangDepartments from './TangDepartments.svelte';
import PantheonChart from './PantheonChart.svelte';
import HighSummit from './HighSummit.svelte';
import MinistersAssembly from './MinistersAssembly.svelte';
import GayaLeague from './GayaLeague.svelte';
import TamlaPrinces from './TamlaPrinces.svelte';
import JoseonMandate from './JoseonMandate.svelte';
import Hwarang from './Hwarang.svelte';
import FourDragons from './FourDragons.svelte';
import FourBeasts from './FourBeasts.svelte';
import RestorationArmy from './RestorationArmy.svelte';

export interface DiagramProps {
	step?: string;
	active?: boolean;
	realm?: string;
}

export const DIAGRAMS: Record<string, Component<DiagramProps>> = {
	'harmony-council': HarmonyCouncil,
	'bone-rank': BoneRank,
	'eight-clans': EightClans,
	'royal-secretariat': RoyalSecretariat,
	'tang-departments': TangDepartments,
	pantheon: PantheonChart,
	'high-summit': HighSummit,
	'ministers-assembly': MinistersAssembly,
	'gaya-league': GayaLeague,
	'tamla-princes': TamlaPrinces,
	'joseon-mandate': JoseonMandate,
	hwarang: Hwarang,
	'four-dragons': FourDragons,
	'four-beasts': FourBeasts,
	'restoration-army': RestorationArmy
};
