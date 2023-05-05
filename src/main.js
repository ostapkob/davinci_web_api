import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		title: 'boobl-goom.ru',
		defaultModel: "text-davinci-003",
		temperature: 1, // /10
		maxTokens: 2048, 
		prompt: "Сочини новый афоризм",
		apiKey: '',
		models: [
			"text-davinci-003",
			"text-davinci-002",
	],
		// options: ["Option 1", "Option 2", "Option 3"],
	}
});

export default app;