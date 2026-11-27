/**
 * Short films. The page keeps the whole episode. The play button runs this:
 * a voiceover that can leave lines out, and a camera move on each still.
 */
export type MovieMove = 'push' | 'pull' | 'left' | 'right' | 'rise';

export interface MovieCutLine {
	kind?: 'line' | 'title' | 'map';
	en: string;
	ko: string;
	/** Image slot id on the episode. */
	still?: string;
	person?: string;
	look?: string;
	hold?: number;
	move?: MovieMove;
	/** Terrain only — the peninsula before the kingdoms are painted on. */
	relief?: boolean;
	year?: number;
}

export const MOVIE_CUTS: Record<string, MovieCutLine[]> = {
	Bihyung: [
		{
			kind: 'title',
			en: 'Bihyung',
			ko: '비형랑',
			still: 'bh-cloud-king-deathbed',
			hold: 2.6,
			move: 'push'
		},
		{
			en: 'Every capital keeps one madman.',
			ko: '수도마다 미친 사람이 하나쯤은 있다.',
			still: 'bh-cloud-king-deathbed',
			hold: 3.4,
			move: 'push'
		},
		{
			en: 'Surabol’s was a prince. He was very good at it.',
			ko: '서라벌의 미친 사람은 왕자였다. 아주 잘했다.',
			still: 'bh-throne-boy',
			hold: 4.2,
			move: 'left'
		},
		{
			en: 'She refused him. A cup tipped, and nobody righted it.',
			ko: '그녀가 거절했다. 잔이 기울었는데, 아무도 세우지 않았다.',
			still: 'bh-dohwa-refuses',
			hold: 4.2,
			move: 'right'
		},
		{
			kind: 'title',
			en: 'Not as smoke.',
			ko: '연기가 아니었다.',
			still: 'bh-tenth-night',
			hold: 2.4,
			move: 'pull'
		},
		{
			en: 'The king, hat in his hand. A little embarrassed to be dead.',
			ko: '임금이다. 갓을 손에 들고. 죽어서 조금 쑥스러워한다.',
			still: 'bh-tenth-night',
			hold: 4.4,
			move: 'pull'
		},
		{
			en: 'Seven days the house wore a coloured cloud. On the eighth, he was gone.',
			ko: '이레 동안 그 집은 오색구름을 입었다. 여드레째, 그는 없었다.',
			still: 'bh-seven-days-cloud',
			hold: 4.8,
			move: 'rise'
		},
		{
			en: 'Morning. A bridge. The court named it, and walked the long way round.',
			ko: '아침. 다리 하나. 조정은 이름을 붙이고 먼 길로 돌아갔다.',
			still: 'bh-bridge-reveal',
			hold: 4.6,
			move: 'push'
		},
		{
			en: 'She sat down and took the stylus out of his hand.',
			ko: '그녀가 옆에 앉았다. 철필을 그의 손에서 뺐다.',
			still: 'bh-chunmyung-bridge',
			hold: 3.8,
			move: 'left'
		},
		{
			en: 'A small wedding. The only room where he never performed.',
			ko: '작은 혼례. 그가 한 번도 연기하지 않은 방.',
			still: 'bh-stream-wedding',
			hold: 4.2,
			move: 'pull'
		},
		{
			en: 'A clerk who was never late, and never seen to eat.',
			ko: '늦지 않는 집사. 먹는 걸 본 사람도 없었다.',
			still: 'bh-gildal-clerk',
			hold: 4,
			move: 'right'
		},
		{
			en: 'One morning the gate was empty. A fox was already on the south road.',
			ko: '어느 아침 문루가 비었다. 여우는 이미 남쪽 길에 있었다.',
			still: 'bh-myth-gildal-fox',
			hold: 4.4,
			move: 'rise'
		},
		{
			en: 'He held the boy the way you hold something a temple lent you.',
			ko: '절에서 빌려 온 물건을 들듯, 아이를 안았다.',
			still: 'bh-chunchu-born',
			hold: 4.2,
			move: 'push'
		},
		{
			en: 'After that, one name was enough to keep a ghost out.',
			ko: '그 뒤로, 귀신을 막기에는 이름 하나면 충분했다.',
			still: 'bh-city-doors-charm',
			hold: 4.2,
			move: 'left'
		},
		{
			en: 'So he drew the fox himself. One lamp. A scrap of paper.',
			ko: '그래서 직접 여우를 그렸다. 등잔 하나. 종이 한 장.',
			still: 'bh-charm-paints',
			hold: 4.2,
			move: 'pull'
		},
		{
			en: 'Tell Surabol. The name is enough.',
			ko: '서라벌에 일러라. 이름이면 된다.',
			still: 'bh-charm-decree',
			person: 'jinpyung',
			hold: 3.6,
			move: 'push'
		},
		{
			en: 'You were never mad.',
			ko: '넌 미친 적이 없었지.',
			still: 'bh-suulbu-chair',
			person: 'sukhuljong',
			hold: 3.4,
			move: 'right'
		},
		{
			en: 'Some nights he still goes down to the water and says their names.',
			ko: '어떤 밤에는 물가로 내려가, 그들의 이름을 부른다.',
			still: 'bh-empty-reeds',
			hold: 4.6,
			move: 'pull'
		}
	],
	'Heaven–Earth King': [
		{
			kind: 'title',
			en: 'Heaven–Earth King',
			ko: '천지왕',
			still: 'hek-above-chaos',
			hold: 2.6,
			move: 'pull'
		},
		{
			en: 'Two suns. Two moons. Nobody slept.',
			ko: '해는 둘. 달도 둘. 아무도 자지 못했다.',
			still: 'hek-ink-two-suns',
			hold: 3.8,
			move: 'push'
		},
		{
			en: 'They dropped in the fields with the hoe still in their hands.',
			ko: '호미를 쥔 채, 밭에서 쓰러졌다.',
			still: 'hek-fields-fall',
			hold: 4,
			move: 'left'
		},
		{
			en: 'The dead used the same road. Nobody had drawn the line yet.',
			ko: '죽은 자도 같은 길을 썼다. 금을 그은 사람이 아직 없었다.',
			still: 'hek-chaos-road',
			hold: 4.2,
			move: 'right'
		},
		{
			en: 'A mother called. She could not tell which voice answered.',
			ko: '어머니가 불렀다. 대답이 누구의 것인지 알 수 없었다.',
			still: 'hek-mother-call',
			hold: 4.2,
			move: 'rise'
		},
		{
			en: 'The rice had a little bite to it.',
			ko: '쌀에, 조금 씹는 맛이 있었다.',
			still: 'hek-ink-sand',
			hold: 3.4,
			move: 'push'
		},
		{
			en: 'Then the floor of the ninth storehouse opened.',
			ko: '그리고 아홉째 곳간 바닥이 열렸다.',
			still: 'hek-ink-fall',
			hold: 3.8,
			move: 'pull'
		},
		{
			en: 'They planted at dusk. By morning the vine had left the roof.',
			ko: '해 질 녘에 심었다. 아침에는 넝쿨이 지붕을 떠나 있었다.',
			still: 'hek-ink-vine',
			hold: 4.4,
			move: 'rise'
		},
		{
			en: 'He breathed out. The second sun broke like a plate.',
			ko: '그가 숨을 내쉬었다. 두 번째 해가 접시처럼 깨졌다.',
			still: 'hek-ink-sun',
			hold: 4.2,
			move: 'push'
		},
		{
			en: 'Midnight. The second moon.',
			ko: '한밤중. 두 번째 달.',
			still: 'hek-arrow-moon',
			hold: 3.2,
			move: 'left'
		},
		{
			en: 'Your flower did well.',
			ko: '네 꽃이 잘 피었구나.',
			still: 'hek-ink-yield',
			person: 'daebyeol',
			hold: 3.4,
			move: 'right'
		},
		{
			en: 'Then he hung a scale from the sky.',
			ko: '그리고 하늘에 저울을 달았다.',
			still: 'hek-ink-scale',
			hold: 3.8,
			move: 'pull'
		},
		{
			en: 'The light ones followed him down.',
			ko: '가벼운 것들이 그를 따라 내려갔다.',
			still: 'hek-ink-descent',
			hold: 3.6,
			move: 'rise'
		},
		{
			kind: 'map',
			en: 'And Samhan. A mountain peninsula, set beside the field where his flowers grow.',
			ko: '그리고 삼한. 산이 많은 반도. 그가 꽃을 심은 밭 옆에.',
			hold: 6.2,
			move: 'pull'
		},
		{
			en: 'The sun took the rail. The day finally had a name.',
			ko: '해가 난간을 잡았다. 낮에 비로소 이름이 붙었다.',
			still: 'hek-haemosu-sky',
			hold: 4.2,
			move: 'push'
		},
		{
			en: 'Then he drove the spirits off the road.',
			ko: '그리고 귀신을 길에서 쫓아냈다.',
			still: 'hek-spirit-border',
			hold: 4,
			move: 'left'
		}
	]
};
