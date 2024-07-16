import { ValidationRule } from 'quasar';

const emailRules: ValidationRule[] = [
    (value: string) => !!value || 'Required.',
    (value: string) => (value || '').length <= 30 || 'Max 30 characters',
    (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
    },
];

const nameRules: ValidationRule[] = [(value: string) => !!value || 'Required.', (value: string) => (value || '').length <= 20 || 'Max 20 characters'];

const mobileNumberRules: ValidationRule[] = [(value: string) => !!value || 'Required.', (value: string) => (value || '').length >= 9 || 'Min 9 characters', (value: string) => (value || '').length <= 13 || 'Max 13 characters'];

const code3Rules: ValidationRule[] = [(value: string) => !!value || 'Required.', (value: string) => (value || '').length >= 2 || 'Min 2 characters', (value: string) => (value || '').length <= 3 || 'Max 3 characters'];

const code1Rules: ValidationRule[] = [(value: string) => !!value || 'Required.', (value: string) => (value || '').length >= 1 || 'Min 1 characters', (value: string) => (value || '').length <= 1 || 'Max 1 characters'];

const descriptionRules: ValidationRule[] = [(value: string) => !!value || 'Required.', (value: string) => (value || '').length <= 100 || 'Max 100 characters'];

const shortDescriptionRules: ValidationRule[] = [(value: string) => !!value || 'Required.', (value: string) => (value || '').length <= 30 || 'Max 30 characters'];

const requireRules: ValidationRule[] = [(value: string) => !!value || 'Required.'];

const numberRules: ValidationRule[] = [
    (value: string) => !!value || 'Required',
    (value: string) => {
        const regexPattern = /^\d+$/;
        return regexPattern.test(value) || 'Not valid. Only Accept Number characters.';
    },
];

const numberRules99: ValidationRule[] = [
    (value: number) => !!value || 'Required',
    (value: number) => (value || 0) < 99 || 'Max 99',
    (value: string) => {
        const regexPattern = /^\d+$/;
        return regexPattern.test(value) || 'Not valid. Only Accept Number characters.';
    },
];

const passwordRules: ValidationRule[] = [
    // Check if the value is not empty
    (value: string) => !!value || 'Required',
    // Check for minimum length and required characters
    (value: string) => value.length >= 8 || 'Minimum length is 8 characters',
    (value: string) => /[A-Z]/.test(value) || 'At least one uppercase letter required',
    (value: string) => /[a-z]/.test(value) || 'At least one lowercase letter required',
    (value: string) => /[0-9]/.test(value) || 'At least one number required',
    (value: string) => /[\W_]/.test(value) || 'At least one symbol required',
];

const passwordRulesUn: ValidationRule[] = [
    // Check for minimum length and required characters
    (value: string) => !value || value.length >= 8 || 'Minimum length is 8 characters',
    (value: string) => !value || /[A-Z]/.test(value) || 'At least one uppercase letter required',
    (value: string) => !value || /[a-z]/.test(value) || 'At least one lowercase letter required',
    (value: string) => !value || /[0-9]/.test(value) || 'At least one number required',
    (value: string) => !value || /[\W_]/.test(value) || 'At least one symbol required',
];

export { emailRules, nameRules, mobileNumberRules, requireRules, numberRules, passwordRules, passwordRulesUn, code3Rules, code1Rules, descriptionRules, shortDescriptionRules, numberRules99 };
