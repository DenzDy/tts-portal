<script>
    export let image, headerText, date, description;

</script>

<div class="w-full h-fit mb-4 rounded-lg border-4 border-[#69ADC6] p-3 flex flex-col gap-3">
    <h1 class="font-[League_Spartan] text-2xl font-semibold">{headerText}</h1>
    <p class="font-[League_Spartan] text-md font-semibold">{date}</p>
    <img src={image} alt="" srcset="" class="w-full h-[175px] object-cover rounded-xl">
    <p class="font-[Garet] text-md">{description}</p>
</div>