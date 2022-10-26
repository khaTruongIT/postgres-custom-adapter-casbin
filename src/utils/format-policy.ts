import {Policy} from '../constants';

export function formatPolicyLine(policy: Policy[]): string {
  const formatString = policy
    .map(re => {
      return JSON.stringify(Object.values(re));
    })
    .join('\n')
    .replace(/(^\[)|(\]$)/gm, '');
  const rules = formatString.split('\n');
  let string = '';
  rules.forEach((n: string, index: number) => {
    const newString = 'p'.concat(',').concat(n).concat('\n');
    string = string + newString;
  });
  return string;
}
