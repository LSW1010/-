import { Category } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'yin-yang-five-elements',
    name: '음양오행 (陰陽五行)',
    description: '명리학의 가장 기본이 되는 목(木), 화(火), 토(土), 금(金), 수(水) 오행과 음양의 조화를 다루며 가볍고 심도 있는 입문 지식을 전합니다.',
    slug: 'yin-yang-five-elements'
  },
  {
    id: 'saju-structure',
    name: '사주팔자 격국론 (格局論)',
    description: '내가 타고난 기질의 중심이 되는 격(格)과 용신(用神)을 찾는 방법과 인생의 타고난 그릇과 쓰임세를 학술적으로 해설합니다.',
    slug: 'saju-structure'
  },
  {
    id: 'ten-gods',
    name: '십성론 (十星論)',
    description: '비겁(比劫), 식상(食傷), 재성(財星), 관성(官星), 인성(印星) 등 인간관계와 물질적 성취 타입을 분석하는 사회적 관계성 해석 모음입니다.',
    slug: 'ten-gods'
  },
  {
    id: 'fortune-timing',
    name: '대운과 세운론 (運路論)',
    description: '인생의 흐름인 10년 주기 대운(大運)과 1년 주기 세운(歲運)을 읽어내어 나에게 맞는 타이밍을 지혜롭게 설계하는 방법입니다.',
    slug: 'fortune-timing'
  },
  {
    id: 'compatibility-love',
    name: '궁합 & 연애운 (宮合論)',
    description: '서로 다른 두 사주가 만나서 겪는 에너지의 융합과 조화, 갈등을 분석하여 갈등을 예방하고 성숙한 관계를 유지하는 길잡이입니다.',
    slug: 'compatibility-love'
  }
];
