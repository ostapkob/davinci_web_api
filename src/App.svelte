<script>
    function handleClick(name) {
        console.log(`Hello ${name}!`);
    }
    import { onMount } from "svelte";
    import { Configuration, OpenAIApi } from "openai";
    import Select, { Option } from "@smui/select";
    import Textfield from "@smui/textfield";
    import CharacterCounter from "@smui/textfield/character-counter";
    import Slider from "@smui/slider";
    import LayoutGrid, { Cell } from "@smui/layout-grid";
    import HelperText from "@smui/textfield/helper-text";
    import IconButton from "@smui/icon-button";
    import History from "./History.svelte";
    import Button, { Label, Icon } from "@smui/button";
    import CircularProgress from "@smui/circular-progress";

    import Test from "./Test.svelte";

    export let title,
        defaultModel,
        models,
        temperature,
        maxTokens,
        apiKey,
        prompt;

    let selectedModel = defaultModel;
    let answer = "";
    let isLoading = false;
    let openai;
    let showKey = false;
    let showHistory = true;
    let history = [];

    async function getResponse() {
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        openai = new OpenAIApi(configuration);
        isLoading = true;
        try {
            const response = await openai.createCompletion({
                model: selectedModel,
                prompt: prompt,
                temperature: temperature,
                max_tokens: maxTokens,
            });
            if (response?.data?.choices?.length) {
                response.data.choices.forEach((choice) => {
                    console.log(choice.text);
                });
                answer = response.data.choices
                    .map((choice) => choice.text)
                    .join("\n");
                saveToHistory();
            } else {
                console.log("No response received.");
            }
        } catch (error) {
            console.log("Error:", error);
        }
        isLoading = false;
    }
    onMount(() => {
        if (localStorage.getItem("apiKey")) {
            apiKey = localStorage.getItem("apiKey");
            showKey = false;
        } else {
            showKey = true;
        }
        let historyData = localStorage.getItem("historyData");
        if (historyData) {
            history = JSON.parse(historyData);
        } else {
            history = [];
        }
    });

    function saveApiKey() {
        localStorage.setItem("apiKey", apiKey);
        showKey = false;
    }

    function cancelRequest() {
        location.reload();
    }

    function changeShowKey() {
        showKey = !showKey;
    }
    function changeShowHistory() {
        showHistory = !showHistory;
    }

    function saveToHistory() {
        let timestamp = new Date().toISOString();

        history = [
            ...history,
            {
                timestamp: timestamp,
                model: selectedModel,
                temperature: temperature,
                maxTokens: maxTokens,
                prompt: prompt,
                answer: answer,
            },
        ];
        localStorage.setItem("historyData", JSON.stringify(history));
    }

    function removeItem(i) {
        console.log(`index ${i}`);
        history = [...history.slice(0, i), ...history.slice(i + 1)];
        localStorage.setItem("historyData", JSON.stringify(history));
    }
</script>

<main>
    <div class="title" span={12}>
        <h2>OpenAI {title}</h2>
        <div style="display: flex; align-items: center;">
            <IconButton class="material-icons" on:click={() => changeShowKey()}
                >key</IconButton
            >
        </div>
        <div style="display: flex; align-items: center;">
            <IconButton
                class="material-icons"
                on:click={() => changeShowHistory()}>history</IconButton
            >
        </div>
    </div>
    {#if showKey}
        <div id="api-key-window" style="margin: 10px">
            <h3>Please enter your API key:</h3>
            <Textfield bind:value={apiKey} label="API Key" style="width: 100%;">
                <HelperText slot="helper">\\mdfs\distr\gpt</HelperText>
            </Textfield>
            <Button on:click={saveApiKey} variant="raised">Save</Button>
        </div>
    {:else}
        <div id="form">
            <LayoutGrid>
                <Cell span={3}>
                    <div
                        class="columns margins"
                        style="justify-content: flex-start;"
                    >
                        <div>
                            <Select bind:value={selectedModel} label="Models">
                                {#each models as model}
                                    <Option value={model}>{model}</Option>
                                {/each}
                            </Select>
                        </div>
                    </div>
                </Cell>
                <Cell span={3}>
                    <Slider
                        bind:value={temperature}
                        min={0}
                        max={2}
                        step={0.1}
                        input$aria-label="Continuous slider"
                    />
                    <pre class="status">Temperature: {temperature}</pre>
                </Cell>
                <Cell span={3}>
                    <Slider
                        bind:value={maxTokens}
                        min={100}
                        max={4000}
                        step={1}
                        input$aria-label="Continuous slider"
                    />
                    <pre class="status">maxTokens: {maxTokens}</pre>
                </Cell>
                <Cell span={12}>
                    <div class="margins">
                        <Textfield
                            style="width: 100%; height: 150px;"
                            helperLine$style="width: 100%;"
                            textarea
                            bind:value={prompt}
                            input$maxlength={2000}
                            label="Prompt"
                        >
                            <CharacterCounter slot="internalCounter"
                                >0 / 2000</CharacterCounter
                            >
                        </Textfield>
                    </div>
                </Cell>
                <Cell span={12}>
                    <div>
                        <Button
                            on:click={getResponse}
                            id="generateBtn"
                            variant="raised"
                            disabled={isLoading}
                            >{isLoading ? "Loading..." : "Get Response"}</Button
                        >
                        {#if isLoading}
                            <Button
                                on:click={cancelRequest}
                                id="generateBtn"
                                color="secondary"
                                variant="raised">{"Cancel"}</Button
                            >
                        {/if}
                    </div>
                </Cell>
                <Cell span={12}>
                    {#if isLoading}
                        <div style="display: flex; justify-content: center">
                            <CircularProgress
                                style="height: 32px; width: 32px;"
                                indeterminate
                            />
                        </div>
                    {/if}
                </Cell>
                <Cell span={12}>
                    {#if showHistory}
                        {#each history.reverse() as el, i}
                            <History {removeItem} {...el} index={i} />
                        {/each}
                    {/if}
                </Cell>
            </LayoutGrid>
        </div>
    {/if}

    <!-- <Test handleClick={handleClick} /> -->
</main>

<style>
    .title {
        display: flex;
        justify-content: space-between;
        max-width: 400px;
        margin: 0 auto;
        padding: 10px 0;
    }
</style>
