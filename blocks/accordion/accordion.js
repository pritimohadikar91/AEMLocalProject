export default function decorate(block){
    const rows = [...block.children];

    const faqItems = rows.map((row) => {
        const cells = [...row.children];

        if (cells.length < 2) return null;

        const question = cells[0].textContent.trim();
        const answer = cells[1];

        if (!question || question.toLowerCase() === 'accordion'){
            return null;
        }

        const details = document.createElement('details');
        details.className = 'accordion-item';

        const summary = document.createElement('summary');
        summary.textContent = question;

        const content = document.createElement('div');
        content.className = 'accordion-content';

        while (answer.firstChild) {
            content.append(answer.firstChild);
        }
        details.append(summary, content);

        return details;
    }).filter(Boolean); 
    
    block.replaceChildren(...faqItems);

}