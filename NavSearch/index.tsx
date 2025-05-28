
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Ordem, Member } from "../../../../pages/Guest/Home";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    TextField,
    MenuItem,
    Button,
    Grid,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '../../../../assets/Icons/pesquisarmembrosgeral.svg';
import cnpPesquisa from '../../../../assets/cnppesquisa.svg' 
import cnpLogo from '../../../../assets/cnplogo.svg' 

interface NavSearchProps {
    ordens: Ordem[];
    handleOnChange: (item: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setItemSearch: (value: string) => void;
    setItemSelected: (item: Ordem | null) => void;
    itemSelected: Ordem | null;
    members: Member[];
    handleMemberRedirect: (member: Member) => void;
    loadingMember: boolean;
}

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 600,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
};

export default function NavSearch({
    ordens,
    handleOnChange,
    handleSubmit,
    setItemSearch,
    setItemSelected,
    itemSelected,
    members,
    handleMemberRedirect,
    loadingMember,
}: NavSearchProps) {
    const [open, setOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState("");
    const [showSelect, setShowSelect] = useState(true);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "details">("list");

    // Add theme and media query for responsive styling
    const theme = useTheme();
    const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const loadingOrdens = !ordens || ordens.length === 0;

    const handleInputChange = (value: string) => {
        setLocalSearch(value);
        setItemSearch(value);
    };

    const handleProfessionSelect = (value: string) => {
        handleOnChange(value);
        setShowSelect(false);
    };

    const handleResetSelection = () => {
        setItemSelected(null);
        setShowSelect(true);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(e);
        setViewMode("list");
        setSelectedMember(null);
        setOpen(true);
    };

    const handleMemberSelect = (member: Member) => {
        setSelectedMember(member);
        setViewMode("details");
        console.log("catera:", member)

        // Não fechamos o modal aqui
    };

    const handleBackToList = () => {
        setViewMode("list");
        setSelectedMember(null);
    };

    const handleCloseAndRedirect = (member: Member) => {
        setOpen(false);
        // Aguarde o fechamento do modal e então redirecione
        setTimeout(() => {
            handleMemberRedirect(member);
        }, 300);
    };

    // Formata a data para exibição
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-PT');
        } catch (error) {
            return "Data indisponível";
        }
    };

    // Componente de skeleton para os membros na lista
    const MemberSkeletons = () => (
        <Grid container spacing={3} sx={{ overflowY: 'visible' }}>
            {[...Array(6)].map((_, idx) => (
                <Grid item xs={12} sm={6} md={6} key={idx} sx={{ display: 'flex' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            p: 3,
                            borderRadius: 2,
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            backgroundColor: 'white',
                        }}
                    >
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box width="100%">
                            <Skeleton variant="text" width="80%" height={24} />
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="text" width="70%" height={20} />
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );

    // Componente de skeleton para detalhes do membro
    const MemberDetailsSkeleton = () => (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
            <Skeleton variant="circular" width={160} height={160} />
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={180} height={24} />
            <Skeleton variant="text" width={220} height={24} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: '4px' }} />
        </Box>
    );

    return (
        <div className="w-full flex justify-center mt-6">
            
            <div className="w-full z-10 transform -translate-y-[60px] px-6 flex flex-col items-center justify-center md:flex-row md:items-start gap-4 bg-white rounded-lg p-4 shadow-md max-w-6xl mx-auto md:-translate-y-[60px] lg:-translate-y-[60px] sm:-translate-y-[0px]">

                {/* Logo e título */}
                <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-start gap-2 text-center md:text-left">
                    <img src={cnpPesquisa} alt="Logo" className="w-10 h-10" />
                    <p className="text-xl font-bold">
                        <span className="text-red-700">CNP</span> Busca
                    </p>
                </div>

                {/* Barra de pesquisa */}
                <div className="flex max-w-[3000px] flex-col md:flex-col w-full gap-4 items-center justify-center lg:flex-row">
                    {showSelect ? (
                        loadingOrdens ? (
                            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: '4px' }} />
                        ) : (
                            <TextField
                                select
                                size="small"
                                className="w-full"
                                defaultValue="Selecionar Profissão"
                                onChange={(e) => handleProfessionSelect(e.target.value)}
                            >
                                <MenuItem value="Selecionar Profissão">Selecione a profissão</MenuItem>
                                {ordens ? (
                                    ordens?.map((ordem, index) =>
                                        ordem.status === "Activo" ? (
                                            <MenuItem key={index} value={JSON.stringify(ordem)}>
                                                {ordem.profissao}
                                            </MenuItem>
                                        ) : ordem.status === "Demo" ? (
                                            <MenuItem key={index} disabled sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                                {ordem.profissao}
                                            </MenuItem>
                                        ) : null
                                    )
                                ) : (
                                    <MenuItem disabled>
                                        <Box display="flex" alignItems="center">
                                            <CircularProgress size={20} sx={{ mr: 1 }} />
                                            Carregando profissões...
                                        </Box>
                                    </MenuItem>
                                )}
                            </TextField>
                        )
                    ) : (
                        <div className="w-full max-w-[500px] flex items-center bg-red-600 text-white h-10 rounded">
                            <div className="flex-grow px-3 py-8 flex items-center whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">
                                {itemSelected?.nome}
                            </div>
                            <button
                                className="h-full px-2 bg-transparent flex-shrink-0 flex items-center justify-center text-white hover:bg-red-700"
                                onClick={handleResetSelection}
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="flex flex-col md:flex-row w-full gap-4 items-center justify-center">
                        {loadingOrdens ? (
                            <>
                                <Skeleton variant="rectangular" className="w-full lg:w-[320px]" height={40} sx={{ borderRadius: '4px' }} />
                                <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '4px' }} />
                            </>
                        ) : (
                            <>
                                <TextField
                                    className="w-full lg:w-[320px]"
                                    type="search"
                                    size="small"
                                    placeholder="Digite o número de carteira ou nome"
                                    value={localSearch}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    disabled={!itemSelected} // Desativa o campo se nenhuma profissão for selecionada
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="w-full sm:w-full md:w-[40px] lg:w-[40px]"
                                    color="error"
                                    disabled={loadingMember || !localSearch.trim() || !itemSelected}
                                    sx={{ height: '40px', minWidth: '40px', padding: '6px' }}
                                >
                                    <img src={SearchIcon} className="w-[24px]" alt="" />
                                </Button>
                            </>
                        )}
                    </form>
                </div>
            </div>

            {/* Modal para mostrar resultados */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                disableEnforceFocus
                disableAutoFocus
                style={{ overflow: 'hidden' }}
            >
                <Box
                    sx={{
                        ...style,
                        bgcolor: 'white',
                        color: 'black',
                        width: viewMode === "details" ? '100%' : '100%',
                        maxWidth: viewMode === "details" ? '600px' : '900px',
                        maxHeight: '90vh',
                        position: 'absolute',
                        margin:"",
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: 2,
                        p: 4,
                        boxShadow: 24,
                        overflowY: 'hidden',
                    }}
                >
                    <div>
                        <div className="h-0 text-end">
                            <IconButton onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h6" color="black">
                                {viewMode === "list" ? <img src={cnpPesquisa} alt="" /> : <img src={cnpLogo} alt="" /> }
                            </Typography>
                        </Box>
                    </div>

                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            overflowY: 'auto',
                            maxHeight: 'calc(90vh - 140px)',
                            pr: isSmallDevice ? 0 : 2,
                            '&::-webkit-scrollbar': {
                                width: isSmallDevice ? '0px' : '8px',
                                display: isSmallDevice ? 'none' : 'block',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555',
                            },
                            msOverflowStyle: isSmallDevice ? 'none' : 'auto',
                            scrollbarWidth: isSmallDevice ? 'none' : 'thin',
                            overflowX: 'hidden',
                        }}
                    >
                        {viewMode === "details" && selectedMember && itemSelected ? (
                            <>
                                {/* Detalhes do membro selecionado */}
                                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                    <img
                                        src={selectedMember.dadosPessoais.fotoURL || "/placeholder-user.png"}
                                        alt={selectedMember.nome}
                                        className="h-[50vh] object-cover rounded-sm"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "/placeholder-user.png";
                                        }}
                                    />
                                    <Typography variant="h6" color="black">{selectedMember.nome}</Typography>
                                    <Typography variant="body2" color="black">{selectedMember.perfil}</Typography>
                                    <Typography variant="body2" color="black">Carteira Nº {selectedMember.numeroCarteira}</Typography>
                                    <Typography variant="body2" color="black">
                                        Data Início: {formatDate(selectedMember.dataInicio)}
                                    </Typography>
                                    <Typography fontWeight="bold" color="black">{itemSelected.nome}</Typography>
                                    <Typography
                                        className={`text-white text-[40px] text-center w-full font-bold px-4 py-2 ${selectedMember.status === "Activo" ? "bg-[#7EBF42]" : "bg-red-600"}`}
                                    >
                                        {selectedMember.status}
                                    </Typography>
                                </Box>
                            </>
                        ) : loadingMember ? (
                            // Skeleton para carregamento de membros
                            viewMode === "details" ? <MemberDetailsSkeleton /> : <MemberSkeletons />
                        ) : members.length === 0 ? (
                            <Typography color="black">Nenhum membro encontrado.</Typography>
                        ) : members.length === 1 && itemSelected ? (
                            // Para um único membro, mostrar detalhes diretamente
                            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                <div className="flex flex-col items-center gap-3">
                                    <img
                                        src={members[0].dadosPessoais.fotoURL || "/placeholder-user.png"}
                                        alt={members[0].nome}
                                        className=" h-[50vh] object-cover rounded-sm"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "/placeholder-user.png";
                                        }}
                                    />
                                    <Typography variant="h6" color="black">{members[0].nome}</Typography>
                                    <Typography variant="body2" color="black">{members[0].perfil}</Typography>
                                    <Typography variant="body2" color="black">Nº Carteira: {members[0].numeroCarteira}</Typography>
                                    <Typography variant="body2" color="black">
                                        Data Início: {formatDate(members[0].dataInicio)}
                                    </Typography>
                                    <Typography fontWeight="bold" color="black">{itemSelected.nome}</Typography>
                                    <Typography
                                        className={`text-white bottom-0 text-[40px] text-center w-full font-bold px-4 py-2 ${members[0].status === "Activo" ? "bg-[#7EBF42]" : "bg-red-600"}`}
                                    >
                                        {members[0].status}
                                    </Typography>
                                </div>
                            </Box>
                        ) : (
                            // Lista de membros encontrados
                            <Box sx={{ width: '100%', py: 2 }}>
                                <Grid container spacing={3} sx={{ overflowY: 'visible' }}>
                                    {members.map((member, idx) => (
                                        <Grid item xs={12} sm={6} md={6} key={idx} sx={{ display: 'flex' }}>
                                            <Box
                                                className="flex justify-between"
                                                sx={{
                                                    display: 'flex',
                                                    gap: 2,
                                                    p: 3,
                                                    borderRadius: 2,
                                                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                    transition: '0.3s',
                                                    width: '100%',
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)',
                                                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                                                    }
                                                }}
                                                onClick={() => handleMemberSelect(member)}
                                            >
                                                {loadingMember ? (
                                                    <>
                                                        <Skeleton variant="circular" width={48} height={48} />
                                                        <Box>
                                                            <Skeleton variant="text" width={120} height={24} />
                                                            <Skeleton variant="text" width={80} height={20} />
                                                            <Skeleton variant="text" width={100} height={20} />
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <div className="flex justify-between gap-4 w-full">
                                                        <div className="flex gap-4">
                                                            <img
                                                                src={member.dadosPessoais.fotoURL || "/placeholder-user.png"}
                                                                alt={member.nome}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                                loading="lazy"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.onerror = null;
                                                                    target.src = "/placeholder-user.png";
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography fontWeight="bold" color="textPrimary">{member.nome}</Typography>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Nº Carteira: {member.numeroCarteira}
                                                                </Typography>
                                                                {/* <Typography variant="body2" color="textSecondary">
                                                                    Data Início: {formatDate(member.dataInicio)}
                                                                </Typography> */}
                                                            </Box>
                                                        </div>
                                                        <div className={`h-10 items-end px-3 py-1 text-white rounded-md flex items-center ${member.status === "Activo" ? "bg-green-600" : "bg-red-600"}`}>
                                                            <Typography>{member.status}</Typography>
                                                        </div>
                                                    </div>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}