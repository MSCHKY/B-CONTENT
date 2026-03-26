import { expect, test } from "@playwright/test";

interface QuoteItem {
    id: string;
    content: string;
    topics: string[];
    emotion: string;
    context?: string;
}

interface QuoteGroup {
    author: string;
    name: string;
    quotes: QuoteItem[];
}

interface ErrorResponse {
    error: string;
}

test.describe("API Knowledge Quotes CRUD", () => {
    test("add quote -> verify -> update -> verify -> delete -> verify", async ({ request }) => {
        const author = "STAHL Test Author";
        const uniqueContent = `API quote test ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const updatedContent = `${uniqueContent} - updated`;

        // 1. Add quote
        const addResponse = await request.post("/api/knowledge/quotes", {
            data: {
                author,
                content: uniqueContent,
                topics: ["test-topic"],
                emotion: "confident"
            },
        });

        expect(addResponse.status()).toBe(201);
        const addedQuote = (await addResponse.json()) as QuoteItem;
        expect(addedQuote.id).toContain(author);
        expect(addedQuote.content).toBe(uniqueContent);

        // 2. Verify quote was added
        const getAfterAddResponse = await request.get(`/api/knowledge/quotes?author=${encodeURIComponent(author)}`);
        expect(getAfterAddResponse.ok()).toBeTruthy();
        const quotesAfterAdd = (await getAfterAddResponse.json()) as QuoteItem[];
        expect(quotesAfterAdd.some(q => q.id === addedQuote.id)).toBeTruthy();

        // 3. Update quote
        const updateResponse = await request.put(`/api/knowledge/quotes/${addedQuote.id}`, {
            data: {
                content: updatedContent,
            },
        });
        expect(updateResponse.ok()).toBeTruthy();
        const updatedQuote = (await updateResponse.json()) as QuoteItem;
        expect(updatedQuote.content).toBe(updatedContent);

        // 4. Verify quote was updated
        const getAfterUpdateResponse = await request.get(`/api/knowledge/quotes?author=${encodeURIComponent(author)}`);
        expect(getAfterUpdateResponse.ok()).toBeTruthy();
        const quotesAfterUpdate = (await getAfterUpdateResponse.json()) as QuoteItem[];
        const foundUpdatedQuote = quotesAfterUpdate.find(q => q.id === addedQuote.id);
        expect(foundUpdatedQuote).toBeDefined();
        expect(foundUpdatedQuote?.content).toBe(updatedContent);

        // 5. Delete quote
        const deleteResponse = await request.delete(`/api/knowledge/quotes/${addedQuote.id}`);
        expect(deleteResponse.ok()).toBeTruthy();
        const deleteBody = await deleteResponse.json();
        expect(deleteBody).toHaveProperty("success", true);

        // 6. Verify quote was deleted
        const getAfterDeleteResponse = await request.get(`/api/knowledge/quotes?author=${encodeURIComponent(author)}`);
        expect(getAfterDeleteResponse.ok()).toBeTruthy();
        const quotesAfterDelete = (await getAfterDeleteResponse.json()) as QuoteItem[];
        expect(quotesAfterDelete.some(q => q.id === addedQuote.id)).toBeFalsy();
    });

    test("returns 404 for updating unknown quote id", async ({ request }) => {
        const response = await request.put("/api/knowledge/quotes/not-a-quote", {
            data: { content: "test" }
        });
        expect(response.status()).toBe(404);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("not found");
    });

    test("returns 404 for deleting unknown quote id", async ({ request }) => {
        const response = await request.delete("/api/knowledge/quotes/not-a-quote");
        expect(response.status()).toBe(404);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("not found");
    });
});
